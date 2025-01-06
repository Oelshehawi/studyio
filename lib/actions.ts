'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import dbConnect from './db';
import { User } from '@/models/User';
import { Response } from '@/models/Response';
import { Progress } from '@/models/Progress';
import { openai } from '@/lib/openai';

interface MyMemoryMatch {
  id: string;
  segment: string;
  translation: string;
  quality: number;
  reference: string;
  usage_count: number;
  subject: string;
  created_by: string;
  last_updated_by: string;
  create_date: string;
  last_update_date: string;
  match: number;
}

interface MyMemoryResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseStatus: number;
  responseMessage?: string;
  matches: MyMemoryMatch[];
}

// Helper to convert Mongoose documents to plain objects
function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function createUser() {
  const { userId } = await auth();
  if (!userId) return null;

  await dbConnect();

  try {
    // Get user data from Clerk
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    // Use findOneAndUpdate with upsert to prevent race conditions
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { email },
      { upsert: true, new: true }
    );

    return serialize(user);
  } catch (error) {
    console.error('Error in createUser:', error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth();
    if (!session?.userId) return null;

    await dbConnect();
    let user = await User.findOne({ clerkId: session.userId });

    // If user doesn't exist, create them
    if (!user) {
      user = await createUser();
    }

    return user ? serialize(user) : null;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

export async function getUserResponses(
  lessonId: string | 'all',
  sectionId?: string
) {
  const user = await getCurrentUser();
  if (!user) return null;

  await dbConnect();

  interface ResponseQuery {
    userId: string;
    lessonId?: string;
    sectionId?: {
      $in?: string[];
      $eq?: string;
    };
  }

  // Base query with user ID
  const query: ResponseQuery = {
    userId: user._id,
  };

  // Add lessonId to query only if it's not 'all'
  if (lessonId !== 'all') {
    query.lessonId = lessonId;
  }

  // Add section filtering
  if (sectionId) {
    query.sectionId = { $eq: sectionId };
  } else {
    // Only include longform answer sections
    query.sectionId = {
      $in: [
        'email-writing', // Professional email responses
        'storytelling', // Narrative responses in casual conversation
        'opinion', // Opinion/discussion responses
        'homework', // Homework responses with key points and questions
      ],
    };
  }

  const responses = await Response.find(query).sort({ createdAt: -1 }).lean();

  return serialize(responses);
}

export async function saveResponse(data: {
  lessonId: string;
  sectionId: string;
  content: string;
  audioUrl?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    await dbConnect();

    // Create response
    const response = await Response.create({
      userId: user._id,
      ...data,
    });

    // Update progress
    await Progress.findOneAndUpdate(
      { userId: user._id, lessonId: data.lessonId },
      {
        $set: {
          lastAccessed: new Date(),
        },
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true,
      }
    );

    revalidatePath(`/lessons/${data.lessonId}`);
    revalidatePath('/');
    return { success: true, data: serialize(response) };
  } catch (error) {
    console.error('[SAVE_RESPONSE]', error);
    return { success: false, error: 'Failed to save response' };
  }
}

export async function updateProgress(data: {
  lessonId: string;
  completed?: boolean;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    await dbConnect();

    const progress = await Progress.findOneAndUpdate(
      { userId: user._id, lessonId: data.lessonId },
      {
        $set: {
          completed: data.completed ?? true,
          lastAccessed: new Date(),
          moduleId: data.lessonId.split('-')[0],
        },
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true,
      }
    );

    revalidatePath(`/lessons/${data.lessonId}`);
    revalidatePath('/');
    return { success: true, data: serialize(progress) };
  } catch (error) {
    console.error('[UPDATE_PROGRESS]', error);
    return { success: false, error: 'Failed to update progress' };
  }
}

export async function submitVocabulary(formData: FormData) {
  const lessonId = formData.get('lessonId') as string;
  await saveResponse({
    lessonId,
    sectionId: 'vocabulary',
    content: formData.get('sentences') as string,
  });
}

export async function translate({
  text,
  sourceLang,
  targetLang,
}: {
  text: string;
  sourceLang: string;
  targetLang: string;
}) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`
    );

    const data = (await response.json()) as MyMemoryResponse;

    if (!response.ok || data.responseStatus !== 200) {
      console.error('Translation error:', data);
      return { error: data.responseMessage || 'Translation failed' };
    }

    // MyMemory provides matches array with alternative translations
    const alternatives =
      data.matches
        ?.filter(
          (match) => match.translation !== data.responseData.translatedText
        )
        .map((match) => match.translation)
        .slice(0, 3) || [];

    return {
      success: true,
      translation: data.responseData.translatedText,
      alternatives,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return { error: 'Translation failed' };
  }
}

interface FeedbackSections {
  strengths: string[];
  improvements: string[];
  actions: string[];
}

interface BilingualFeedback {
  en: FeedbackSections;
  ar: FeedbackSections;
}

interface Feedback {
  grade: string;
  advice: BilingualFeedback;
}

function extractBilingualFeedback(feedback: string): BilingualFeedback {
  // Extract English sections
  const englishStrengths =
    feedback
      .match(/Strengths:\n((?:•[^\n]+\n?)+)/)?.[1]
      .split('\n')
      .filter((line) => line.startsWith('•'))
      .map((line) => line.replace('•', '').trim()) || [];

  const englishImprovements =
    feedback
      .match(/Areas for Improvement:\n((?:•[^\n]+\n?)+)/)?.[1]
      .split('\n')
      .filter((line) => line.startsWith('•'))
      .map((line) => line.replace('•', '').trim()) || [];

  const englishActions =
    feedback
      .match(/Action Items:\n((?:[\d]\.[^\n]+\n?)+)/)?.[1]
      .split('\n')
      .filter((line) => /^\d\./.test(line))
      .map((line) => line.replace(/^\d\./, '').trim()) || [];

  // Extract Arabic sections
  const arabicStrengths =
    feedback
      .match(/النقاط الحلوة:\n((?:•[^\n]+\n?)+)/)?.[1]
      .split('\n')
      .filter((line) => line.startsWith('•'))
      .map((line) => line.replace('•', '').trim()) || [];

  const arabicImprovements =
    feedback
      .match(/المحتاج شغل:\n((?:•[^\n]+\n?)+)/)?.[1]
      .split('\n')
      .filter((line) => line.startsWith('•'))
      .map((line) => line.replace('•', '').trim()) || [];

  const arabicActions =
    feedback
      .match(/عشان تتحسن لازم:\n((?:[١٢٣]\.[^\n]+\n?)+)/)?.[1]
      .split('\n')
      .filter((line) => /^[١٢٣]\./.test(line))
      .map((line) => line.replace(/^[١٢٣]\./, '').trim()) || [];

  return {
    en: {
      strengths: englishStrengths,
      improvements: englishImprovements,
      actions: englishActions,
    },
    ar: {
      strengths: arabicStrengths,
      improvements: arabicImprovements,
      actions: arabicActions,
    },
  };
}

function extractGrade(feedback: string): string {
  const gradeMatch = feedback.match(/Grade:\s*([A-F])/i);
  return gradeMatch ? gradeMatch[1] : 'N/A';
}

export async function gradeResponse(responseId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    await dbConnect();

    // Get the response
    const response = await Response.findById(responseId);
    if (!response) {
      return { success: false, error: 'Response not found' };
    }

    // Get AI feedback
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful teaching assistant that grades student responses and provides constructive feedback. The student is learning English, and you should provide feedback in both English and Egyptian Arabic dialect (العامية المصرية - not Modern Standard Arabic).

When writing in Egyptian Arabic, use everyday Egyptian expressions and the way Egyptians actually speak. For example, use words like:
- "عايز/عاوز" instead of "أريد"
- "بتاع" instead of "خاص"
- "عشان" instead of "لأن"
- "دلوقتي" instead of "الآن"
- "ازاي" instead of "كيف"

In your feedback, always quote specific parts of the student's text to illustrate your points. Use quotation marks ("") when referencing the text.

Format your response exactly as follows:

Grade: [A/B/C/D/F]

English Feedback:
Strengths:
• [Point 1 with specific example: "quote from text"]
• [Point 2 with specific example: "quote from text"]

Areas for Improvement:
• [Point 1 with specific example: "quote from text"] → Suggested improvement
• [Point 2 with specific example: "quote from text"] → Suggested improvement

Action Items:
1. [Specific action based on improvement point 1]
2. [Specific action based on improvement point 2]
3. [General action for overall improvement]

التقييم بالعامية المصرية:
النقاط الحلوة:
• [النقطة ١ مع مثال: "اقتباس من النص"]
• [النقطة ٢ مع مثال: "اقتباس من النص"]

المحتاج شغل:
• [النقطة ١ مع مثال: "اقتباس من النص"] ← التحسين المقترح
• [النقطة ٢ مع مثال: "اقتباس من النص"] ← التحسين المقترح

عشان تتحسن لازم:
١. [خطوة محددة بناءً على نقطة التحسين الأولى]
٢. [خطوة محددة بناءً على نقطة التحسين الثانية]
٣. [خطوة عامة للتحسين الشامل]`,
        },
        {
          role: 'user',
          content: `Student's Response: ${response.content}\n\nPlease provide a grade and structured feedback following the format exactly. Make sure to include specific quotes from the text to support your feedback points.`,
        },
      ],
    });

    const feedbackContent = completion.choices[0]?.message?.content || '';

    const feedback: Feedback = {
      grade: extractGrade(feedbackContent),
      advice: extractBilingualFeedback(feedbackContent),
    };

    // Update the response with feedback
    await Response.findByIdAndUpdate(responseId, { feedback });

    return { success: true, data: feedback };
  } catch (error) {
    console.error('Error grading response:', error);
    return { success: false, error: 'Failed to grade response' };
  }
}

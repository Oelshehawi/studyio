'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import dbConnect from './db';
import { User } from '@/models/User';
import { Response } from '@/models/Response';
import { Progress } from '@/models/Progress';

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
    // Try to find existing user first
    let user = await User.findOne({ clerkId: userId });
    if (user) return serialize(user);

    // Get user data from Clerk
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    // Try to create user, if it fails due to duplicate, find and return existing
    try {
      user = await User.create({
        clerkId: userId,
        email,
      });
      return serialize(user);
    } catch (error) {
      // If error is duplicate key, try to find the user again
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 11000
      ) {
        user = await User.findOne({ clerkId: userId });
        return serialize(user);
      }
      throw error;
    }
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

export async function getUserResponses(lessonId: string, sectionId?: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  await dbConnect();
  const query = {
    userId: user._id,
    lessonId,
    ...(sectionId ? { sectionId } : {}),
  };

  const responses = await Response.find(query).sort({ createdAt: -1 });
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

export async function submitHomework(formData: FormData) {
  const lessonId = formData.get('lessonId') as string;
  await saveResponse({
    lessonId,
    sectionId: 'homework',
    content: formData.get('homework') as string,
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

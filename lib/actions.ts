'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from './prisma';
import { getCurrentUser } from './db';

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

    // Create response
    const response = await prisma.response.create({
      data: {
        userId: user.id,
        ...data,
      },
    });

    // Update progress
    await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: data.lessonId,
        },
      },
      update: {
        lastAccessed: new Date(),
      },
      create: {
        userId: user.id,
        lessonId: data.lessonId,
        moduleId: data.lessonId.split('-')[0],
        lastAccessed: new Date(),
      },
    });

    revalidatePath(`/lessons/${data.lessonId}`);
    revalidatePath('/');
    return { success: true, data: response };
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

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: data.lessonId,
        },
      },
      update: {
        completed: data.completed ?? true,
        lastAccessed: new Date(),
      },
      create: {
        userId: user.id,
        lessonId: data.lessonId,
        moduleId: data.lessonId.split('-')[0],
        completed: data.completed ?? true,
        lastAccessed: new Date(),
      },
    });

    revalidatePath(`/lessons/${data.lessonId}`);
    revalidatePath('/');
    return { success: true, data: progress };
  } catch (error) {
    console.error('[UPDATE_PROGRESS]', error);
    return { success: false, error: 'Failed to update progress' };
  }
}

export async function submitVocabulary(formData: FormData) {
  'use server';

  const lessonId = formData.get('lessonId') as string;
  await saveResponse({
    lessonId,
    sectionId: 'vocabulary',
    content: formData.get('sentences') as string,
  });
}

export async function submitHomework(formData: FormData) {
  'use server';

  const lessonId = formData.get('lessonId') as string;
  await saveResponse({
    lessonId,
    sectionId: 'homework',
    content: formData.get('homework') as string,
  });
}

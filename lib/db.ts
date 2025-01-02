'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';

export async function getCurrentUser() {
  const session = await auth();
  if (!session.userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: session.userId },
  });

  return user;
}

export async function getUserResponses(lessonId: string, sectionId?: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const responses = await prisma.response.findMany({
    where: {
      userId: user.id,
      lessonId,
      ...(sectionId ? { sectionId } : {}),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return responses;
}

'use client';

import { updateProgress } from '@/lib/actions';

interface CompleteButtonProps {
  lessonId: string;
  isCompleted?: boolean;
}

export default function CompleteButton({
  lessonId,
  isCompleted,
}: CompleteButtonProps) {
  return isCompleted ? (
    <div className='px-4 py-2 bg-green-50 text-green-800 rounded-md'>
      ✓ Completed
    </div>
  ) : (
    <form
      action={async () => {
        await updateProgress({
          lessonId,
          completed: true,
        });
      }}
    >
      <button
        type='submit'
        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
      >
        Mark Lesson Complete
      </button>
    </form>
  );
}

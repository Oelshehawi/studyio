import { getUserResponses } from '@/lib/actions';
import ResponseCard from '../_components/shared/ResponseCard';
import LessonLayout from '../_components/LessonLayout';
import type { DbResponse } from '@/lib/types';

export default async function ResponsesPage() {
  const responses = (await getUserResponses('all')) as DbResponse[] | null;

  return (
    <LessonLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Your Responses
          </h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            View and get feedback on all your lesson responses
          </p>
        </div>

        <div className='grid gap-6'>
          {responses?.map((response) => (
            <ResponseCard key={response._id} response={response} />
          ))}
          {(!responses || responses.length === 0) && (
            <div className='text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
              <p className='text-gray-600 dark:text-gray-300'>
                You haven&apos;t submitted any responses yet. Complete lesson
                exercises to see them here!
              </p>
            </div>
          )}
        </div>
      </div>
    </LessonLayout>
  );
}

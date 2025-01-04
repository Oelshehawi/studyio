import { Suspense } from 'react';
import LessonCard from '@/app/_components/shared/LessonCard';
import SavedResponses from '@/app/_components/shared/SavedResponses';
import AudioRecorder from '@/app/_components/shared/AudioRecorder';
import WatchSection from './WatchSection';
import ConversationPractice from './ConversationPractice';
import StorytellingSection from './StorytellingSection';
import OpinionSection from './OpinionSection';

interface CasualConversationLessonProps {
  lessonId?: string;
}

export default function CasualConversationLesson({
  lessonId = 'casual-conversation-1',
}: CasualConversationLessonProps) {
  return (
    <div className='max-w-4xl mx-auto px-2 sm:px-6'>
      <div className='mb-8'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
              Today&apos;s English Lesson: Casual Conversations 🗣️
            </h1>
            <p className='text-gray-600 dark:text-gray-300'>
              Learn to express yourself naturally in everyday situations
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <LessonCard
          title='Watch & Learn'
          timeNeeded='10 mins'
          sectionNumber={1}
        >
          <WatchSection lessonId={lessonId} />
        </LessonCard>

        <LessonCard
          title='Conversation Practice'
          timeNeeded='15 mins'
          sectionNumber={2}
        >
          <ConversationPractice lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='conversation' />
          </Suspense>
        </LessonCard>

        <LessonCard
          title='Tell Your Story'
          timeNeeded='10 mins'
          sectionNumber={3}
        >
          <StorytellingSection lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='storytelling' />
          </Suspense>
        </LessonCard>

        <LessonCard
          title='Express Your Opinion'
          timeNeeded='10 mins'
          sectionNumber={4}
        >
          <OpinionSection lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='opinion' />
          </Suspense>
        </LessonCard>

        <LessonCard
          title='Speaking Practice'
          timeNeeded='15 mins'
          sectionNumber={5}
        >
          <div className='space-y-4'>
            <p className='text-gray-800 dark:text-gray-200'>
              Record yourself having a casual conversation about one of these
              topics:
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-800 dark:text-gray-200'>
              <li>Your favorite weekend activities</li>
              <li>A fun travel experience</li>
              <li>Your hobbies and interests</li>
              <li>A local festival or tradition</li>
            </ul>
            <AudioRecorder lessonId={lessonId} />
            <Suspense
              fallback={
                <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
              }
            >
              <SavedResponses lessonId={lessonId} sectionId='speaking' />
            </Suspense>
          </div>
        </LessonCard>
      </div>
    </div>
  );
}

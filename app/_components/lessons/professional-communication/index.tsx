import { Suspense } from 'react';
import LessonCard from '@/app/_components/shared/LessonCard';
import EmailExercise from '../../shared/EmailExercise';
import SavedResponses from '@/app/_components/shared/SavedResponses';
import AudioRecorder from '@/app/_components/shared/AudioRecorder';
import WatchSection from './WatchSection';
import VocabularySection from './VocabularySection';
import HomeworkSection from './HomeworkSection';

interface ProfessionalCommunicationLessonProps {
  lessonId?: string;
}

export default function ProfessionalCommunicationLesson({
  lessonId = 'professional-communication-1',
}: ProfessionalCommunicationLessonProps) {
  return (
    <div className='max-w-4xl mx-auto px-2 sm:px-6'>
      <div className='mb-8'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
              Today&apos;s English Lesson: Professional Communication 🎯
            </h1>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <LessonCard title='Watch First' timeNeeded='15 mins' sectionNumber={1}>
          <WatchSection />
        </LessonCard>

        <LessonCard
          title='New Vocabulary & Phrases'
          timeNeeded='15 mins'
          sectionNumber={2}
        >
          <VocabularySection lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='vocabulary' />
          </Suspense>
        </LessonCard>

        <LessonCard
          title='Speaking Practice'
          timeNeeded='15 mins'
          sectionNumber={3}
        >
          <div className='space-y-4'>
            <p className='text-gray-800 dark:text-gray-200'>
              Record yourself (1-2 minutes) talking about:
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-800 dark:text-gray-200'>
              <li>Your current job</li>
              <li>Your career goals</li>
              <li>A challenge at work</li>
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

        <LessonCard
          title='Email Writing'
          timeNeeded='10 mins'
          sectionNumber={4}
        >
          <EmailExercise lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-8 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='email-writing' />
          </Suspense>
        </LessonCard>

        <LessonCard title='Homework' timeNeeded='5 mins' sectionNumber={5}>
          <HomeworkSection lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='homework' />
          </Suspense>
        </LessonCard>
      </div>

      <div className='mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-md'>
        <p className='text-gray-900 dark:text-gray-100 font-medium'>
          Next Topic: Coming Soon Practice! 🎯
        </p>
      </div>
    </div>
  );
}

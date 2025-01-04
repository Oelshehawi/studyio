import { Suspense } from 'react';
import LessonCard from '@/app/_components/shared/LessonCard';
import SavedResponses from '@/app/_components/shared/SavedResponses';
import TaxBasics from './TaxBasics';
import IncomeTax from './IncomeTax';
import Deductions from './Deductions';
import FilingProcess from './FilingProcess';
import Scenarios from './Scenarios';

interface TaxEssentialsLessonProps {
  lessonId?: string;
}

export default function TaxEssentialsLesson({
  lessonId = 'tax-essentials-1',
}: TaxEssentialsLessonProps) {
  return (
    <div className='max-w-4xl mx-auto px-2 sm:px-6'>
      <div className='mb-8'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
              Tax Talk: BC Edition 📊
            </h1>
            <p className='text-gray-600 dark:text-gray-300'>
              Learn English while mastering Canadian tax concepts
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <LessonCard
          title='Tax Basics & Vocabulary'
          timeNeeded='15 mins'
          sectionNumber={1}
        >
          <TaxBasics lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='tax-basics' />
          </Suspense>
        </LessonCard>

        <LessonCard
          title='Income Tax Essentials'
          timeNeeded='20 mins'
          sectionNumber={2}
        >
          <IncomeTax lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='income-tax' />
          </Suspense>
        </LessonCard>

        <LessonCard
          title='Credits & Deductions'
          timeNeeded='20 mins'
          sectionNumber={3}
        >
          <Deductions lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='deductions' />
          </Suspense>
        </LessonCard>

        <LessonCard
          title='Filing Process'
          timeNeeded='15 mins'
          sectionNumber={4}
        >
          <FilingProcess lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='filing' />
          </Suspense>
        </LessonCard>

        <LessonCard
          title='Real-life Scenarios'
          timeNeeded='20 mins'
          sectionNumber={5}
        >
          <Scenarios lessonId={lessonId} />
          <Suspense
            fallback={
              <div className='mt-4 animate-pulse h-32 bg-gray-100 dark:bg-gray-700 rounded-md' />
            }
          >
            <SavedResponses lessonId={lessonId} sectionId='scenarios' />
          </Suspense>
        </LessonCard>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { gradeResponse } from '@/lib/actions';
import { Button } from './Button';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import type { DbResponse } from '@/lib/types';
import { formatResponse } from './responseFormatters';

interface ResponseCardProps {
  response: DbResponse;
}

function formatLessonTitle(lessonId: string): string {
  return lessonId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatSectionId(sectionId: string): string {
  return sectionId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function ResponseCard({ response }: ResponseCardProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(response.feedback);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const requestGrading = async () => {
    setLoading(true);
    try {
      const result = await gradeResponse(response._id);
      if (result.success) {
        setFeedback(result.data);
      }
    } catch (error) {
      console.error('Error grading response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex flex-col space-y-1'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>
              {formatLessonTitle(response.lessonId)}
            </h3>
            <span className='text-sm text-gray-500'>
              {formatDate(response.createdAt)}
            </span>
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {formatSectionId(response.sectionId)}
          </p>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4'>
          {formatResponse(
            response.content,
            response.sectionId,
            response.lessonId
          )}
        </div>

        {feedback && (
          <div className='rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'>
            <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-3'>
              <div className='flex items-center gap-3'>
                <h4 className='font-medium'>Feedback</h4>
                {feedback.grade && (
                  <div className='inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'>
                    Grade: {feedback.grade}
                  </div>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  setLanguage((lang) => (lang === 'ar' ? 'en' : 'ar'))
                }
                className='text-sm'
              >
                {language === 'ar' ? 'English' : 'العربية'}
              </Button>
            </div>
            {feedback.advice && (
              <div
                className='divide-y divide-gray-100 dark:divide-gray-800'
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className='p-4 space-y-4'>
                  <div className='space-y-2'>
                    <h5 className='font-medium text-green-700 dark:text-green-400'>
                      {language === 'ar' ? 'النقاط الحلوة' : 'Strengths'}
                    </h5>
                    <ul className='list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200'>
                      {feedback.advice[language].strengths.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className='space-y-2'>
                    <h5 className='font-medium text-amber-700 dark:text-amber-400'>
                      {language === 'ar'
                        ? 'المحتاج شغل'
                        : 'Areas for Improvement'}
                    </h5>
                    <ul className='list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200'>
                      {feedback.advice[language].improvements.map(
                        (point, i) => (
                          <li key={i}>{point}</li>
                        )
                      )}
                    </ul>
                  </div>
                  <div className='space-y-2'>
                    <h5 className='font-medium text-blue-700 dark:text-blue-400'>
                      {language === 'ar' ? 'عشان تتحسن لازم' : 'Action Items'}
                    </h5>
                    <ol className='list-decimal list-inside space-y-1 text-gray-800 dark:text-gray-200'>
                      {feedback.advice[language].actions.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={requestGrading}
          disabled={loading}
          variant='outline'
          className='w-full'
        >
          {loading
            ? 'Grading...'
            : feedback
            ? 'Request New Feedback'
            : 'Get Feedback'}
        </Button>
      </CardFooter>
    </Card>
  );
}

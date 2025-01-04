'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface EmailExerciseProps {
  lessonId: string;
}

export default function EmailExercise({ lessonId }: EmailExerciseProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailContent.trim() || !subject.trim()) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'email-writing',
        content: `Subject: ${subject}\n\n${emailContent}`,
      });

      if (response.success) {
        setShowFeedback(true);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className='space-y-6 text-black dark:text-white'>
      <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md'>
        <h4 className='font-semibold mb-4 text-gray-900 dark:text-white'>
          Task: Write a Professional Email
        </h4>
        <div className='space-y-4 text-gray-800 dark:text-gray-200'>
          <p>Write a professional email to a potential client about:</p>
          <ul className='list-disc list-inside space-y-2'>
            <li>Introducing your company&apos;s services</li>
            <li>Highlighting a recent successful project</li>
            <li>Proposing a meeting to discuss potential collaboration</li>
          </ul>
          <div className='mt-4'>
            <p className='font-medium mb-2'>Remember to include:</p>
            <ul className='list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300'>
              <li>Clear subject line</li>
              <li>Professional greeting</li>
              <li>Brief company introduction</li>
              <li>Value proposition</li>
              <li>Call to action</li>
              <li>Professional closing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label className='block mb-2 text-gray-900 dark:text-white font-medium'>
                Subject:
              </label>
              <input
                type='text'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className='w-full p-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600'
                placeholder='Enter email subject...'
                required
              />
            </div>

            <div>
              <label className='block mb-2 text-gray-900 dark:text-white font-medium'>
                Email Body:
              </label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={12}
                className='w-full p-3 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed'
                placeholder='Write your email here...'
                required
                disabled={isSaving}
              />
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={isSaving || !emailContent.trim() || !subject.trim()}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
              >
                {isSaving ? (
                  <>
                    <svg
                      className='animate-spin h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Submit Email'
                )}
              </button>
            </div>
          </div>
        </form>

        {showFeedback && (
          <div className='mt-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-100 rounded-md'>
            Your email has been submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
}

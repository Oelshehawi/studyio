'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface HomeworkSectionProps {
  lessonId: string;
}

export default function HomeworkSection({ lessonId }: HomeworkSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [content, setContent] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'homework',
        content,
      });

      if (response.success) {
        setShowFeedback(true);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className='space-y-4 text-black dark:text-white'>
      <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md'>
        <h4 className='font-semibold mb-2 text-gray-900 dark:text-white'>
          Tasks:
        </h4>
        <ul className='list-decimal list-inside space-y-2 text-gray-800 dark:text-gray-200'>
          <li>
            Read the article:{' '}
            <a
              href='https://www.mindtools.com/pages/article/newCS_85.htm'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 dark:text-blue-400 hover:underline'
            >
              &quot;The 7 Cs of Communication&quot;
            </a>
          </li>
          <li>Write 5 key points you learned</li>
          <li>List 3 questions you have</li>
        </ul>
      </div>
      <div className='mt-6'>
        <form onSubmit={handleSubmit}>
          <label className='block mb-2 text-gray-900 dark:text-white font-medium'>
            Submit your homework:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className='w-full p-3 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed'
            placeholder='Enter your key points and questions here...'
            required
            disabled={isSaving}
          />
          <div className='mt-2 flex items-center space-x-4'>
            <button
              type='submit'
              disabled={isSaving || !content.trim()}
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
                'Submit Homework'
              )}
            </button>
          </div>
        </form>

        {showFeedback && (
          <div className='mt-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-100 rounded-md'>
            Your homework has been submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
}

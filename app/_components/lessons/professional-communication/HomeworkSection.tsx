'use client';

import { useState } from 'react';
import { submitHomework } from '@/lib/actions';

interface HomeworkSectionProps {
  lessonId: string;
}

export default function HomeworkSection({ lessonId }: HomeworkSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    try {
      await submitHomework(formData);
      setShowFeedback(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className='space-y-4 text-black'>
      <div className='bg-gray-50 p-4 rounded-md'>
        <h4 className='font-semibold mb-2 text-gray-900'>Tasks:</h4>
        <ul className='list-decimal list-inside space-y-2 text-gray-800'>
          <li>
            Read the article:{' '}
            <a
              href='https://www.mindtools.com/pages/article/newCS_85.htm'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              &quot;The 7 Cs of Communication&quot;
            </a>
          </li>
          <li>Write 5 key points you learned</li>
          <li>List 3 questions you have</li>
        </ul>
      </div>
      <div className='mt-6'>
        <form action={handleSubmit}>
          <input type='hidden' name='lessonId' value={lessonId} />
          <label className='block mb-2 text-gray-900 font-medium'>
            Submit your homework:
          </label>
          <textarea
            name='homework'
            rows={8}
            className='w-full p-3 border rounded-md'
            placeholder='Enter your key points and questions here...'
            required
          />
          <button
            type='submit'
            disabled={isSaving}
            className='mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
          >
            {isSaving ? 'Submitting...' : 'Submit Homework'}
          </button>
        </form>

        {showFeedback && (
          <div className='mt-4 p-4 bg-green-50 text-green-800 rounded-md'>
            Your homework has been submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
}

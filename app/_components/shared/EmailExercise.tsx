'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface EmailExerciseProps {
  lessonId: string;
}

export default function EmailExercise({ lessonId }: EmailExerciseProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    setMessage(null);

    try {
      const content = formData.get('email') as string;
      const response = await saveResponse({
        lessonId,
        sectionId: 'email-writing',
        content,
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Your response has been saved!' });
      } else {
        setMessage({
          type: 'error',
          text:
            response.error || 'Failed to save your response. Please try again.',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Failed to save your response. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className='space-y-4'>
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>

        <div className='mb-6 p-4 bg-yellow-50 rounded-md'>
          <p className='text-sm text-gray-800'>
            <strong>Task:</strong> Write a professional email to your manager
            requesting a day off next week. Consider using the phrases we
            learned and maintain a professional tone.
          </p>
        </div>

        <form action={handleSubmit} className='space-y-4'>
          <div>
            <textarea
              name='email'
              rows={6}
              className='w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800'
              placeholder='Write your professional email here...'
              required
            />
          </div>

          <div className='flex items-center justify-start'>
            <button
              type='submit'
              disabled={isSaving}
              className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
            >
              {isSaving ? 'Saving...' : 'Save Response'}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

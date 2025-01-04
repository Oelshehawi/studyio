'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface StorytellingProps {
  lessonId: string;
}

const STORY_PROMPTS = [
  'Tell us about a memorable celebration in your life',
  'Share a funny misunderstanding due to language or cultural differences',
  'Describe an interesting person you met while traveling',
  'Talk about a traditional dish from your culture',
];

export default function StorytellingSection({ lessonId }: StorytellingProps) {
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [storyContent, setStoryContent] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!storyContent.trim()) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'storytelling',
        content: JSON.stringify({
          prompt: STORY_PROMPTS[selectedPrompt],
          story: storyContent,
        }),
      });

      if (response.success) {
        setShowFeedback(true);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className='space-y-6'>
      <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg'>
        <h3 className='font-medium text-lg text-gray-900 dark:text-white mb-4'>
          Choose a Story Prompt:
        </h3>
        <div className='grid gap-3'>
          {STORY_PROMPTS.map((prompt, index) => (
            <label
              key={index}
              className={`flex items-start gap-2 p-3 rounded-lg cursor-pointer ${
                selectedPrompt === index
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 border-2 border-transparent'
              }`}
            >
              <input
                type='radio'
                name='story-prompt'
                checked={selectedPrompt === index}
                onChange={() => setSelectedPrompt(index)}
                className='mt-1'
              />
              <span className='text-gray-800 dark:text-gray-200'>{prompt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className='space-y-4'>
        <div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg'>
          <h4 className='font-medium text-yellow-900 dark:text-yellow-100 mb-2'>
            Story Structure Tips 📝
          </h4>
          <ul className='list-disc list-inside space-y-1 text-yellow-800 dark:text-yellow-200'>
            <li>Start with when and where it happened</li>
            <li>Introduce the main people involved</li>
            <li>Describe what happened in sequence</li>
            <li>Share how you felt or what you learned</li>
            <li>End with a memorable conclusion</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label className='block mb-2 text-gray-900 dark:text-white font-medium'>
                Your Story:
              </label>
              <textarea
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                rows={8}
                className='w-full p-3 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed'
                placeholder='Write your story here...'
                required
                disabled={isSaving}
              />
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={isSaving || !storyContent.trim()}
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
                  'Share Your Story'
                )}
              </button>
            </div>
          </div>
        </form>

        {showFeedback && (
          <div className='mt-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-100 rounded-md'>
            Your story has been shared successfully!
          </div>
        )}
      </div>
    </div>
  );
}

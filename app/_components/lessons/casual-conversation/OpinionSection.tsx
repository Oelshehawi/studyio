'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface OpinionSectionProps {
  lessonId: string;
}

const TOPICS = [
  {
    title: 'Social Media',
    question:
      'Do you think social media has made communication better or worse? Why?',
    helpfulPhrases: [
      'In my opinion...',
      'I believe that...',
      'From my perspective...',
      'The way I see it...',
    ],
  },
  {
    title: 'Traditional vs Modern',
    question:
      'Is it important to preserve traditional customs in modern society? Share your thoughts.',
    helpfulPhrases: [
      'On one hand...',
      'On the other hand...',
      'While I understand...',
      'However...',
    ],
  },
  {
    title: 'Technology',
    question:
      'How has technology changed the way we make and maintain friendships?',
    helpfulPhrases: [
      'Based on my experience...',
      'For instance...',
      'This reminds me of...',
      'To give an example...',
    ],
  },
];

export default function OpinionSection({ lessonId }: OpinionSectionProps) {
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [opinion, setOpinion] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!opinion.trim()) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'opinion',
        content: JSON.stringify({
          topic: TOPICS[selectedTopic].title,
          question: TOPICS[selectedTopic].question,
          opinion,
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
          Choose a Topic:
        </h3>
        <div className='grid gap-3'>
          {TOPICS.map((topic, index) => (
            <label
              key={index}
              className={`flex items-start gap-2 p-3 rounded-lg cursor-pointer ${
                selectedTopic === index
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 border-2 border-transparent'
              }`}
            >
              <input
                type='radio'
                name='topic'
                checked={selectedTopic === index}
                onChange={() => setSelectedTopic(index)}
                className='mt-1'
              />
              <div>
                <div className='font-medium text-gray-900 dark:text-white'>
                  {topic.title}
                </div>
                <div className='text-gray-600 dark:text-gray-300 text-sm mt-1'>
                  {topic.question}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className='space-y-4'>
        <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg'>
          <h4 className='font-medium text-purple-900 dark:text-purple-100 mb-2'>
            Helpful Phrases 💭
          </h4>
          <div className='flex flex-wrap gap-2'>
            {TOPICS[selectedTopic].helpfulPhrases.map((phrase, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 rounded text-sm'
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label className='block mb-2 text-gray-900 dark:text-white font-medium'>
                Share Your Opinion:
              </label>
              <textarea
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                rows={8}
                className='w-full p-3 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed'
                placeholder='Write your thoughts here...'
                required
                disabled={isSaving}
              />
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={isSaving || !opinion.trim()}
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
                  'Share Your Opinion'
                )}
              </button>
            </div>
          </div>
        </form>

        {showFeedback && (
          <div className='mt-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-100 rounded-md'>
            Your opinion has been shared successfully!
          </div>
        )}
      </div>
    </div>
  );
}

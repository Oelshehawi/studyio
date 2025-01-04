'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface ConversationPracticeProps {
  lessonId: string;
}

const SCENARIOS = [
  {
    id: 1,
    situation: 'Meeting someone new at a social event',
    dialogue: [
      {
        speaker: 'Person A',
        text: "Hi there! I don't think we've met. I'm Sarah.",
        isUser: false,
      },
      {
        speaker: 'You',
        text: 'Choose your response:',
        options: [
          "Nice to meet you, Sarah! I'm [Your name]. Are you enjoying the event?",
          "Hey! Yeah, I'm new here.",
          'Hello.',
        ],
        isUser: true,
      },
    ],
  },
  {
    id: 2,
    situation: 'Discussing weekend plans',
    dialogue: [
      {
        speaker: 'Person B',
        text: 'Got any exciting plans for the weekend?',
        isUser: false,
      },
      {
        speaker: 'You',
        text: 'Choose your response:',
        options: [
          'Nothing special, just staying home.',
          "Yes! I'm planning to try out this new restaurant and maybe go hiking. How about you?",
          "I don't know yet.",
        ],
        isUser: true,
      },
    ],
  },
  {
    id: 3,
    situation: 'Talking about hobbies',
    dialogue: [
      {
        speaker: 'Person C',
        text: "I've recently started learning photography. Do you have any hobbies?",
        isUser: false,
      },
      {
        speaker: 'You',
        text: 'Choose your response:',
        options: [
          "That's cool! I love [your hobby]. How long have you been into photography?",
          "No, I'm usually too busy.",
          'Photography is nice.',
        ],
        isUser: true,
      },
    ],
  },
];

export default function ConversationPractice({
  lessonId,
}: ConversationPracticeProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const scenario = SCENARIOS[currentScenario];
  const userResponse = scenario.dialogue.find((d) => d.isUser);
  const selectedAnswer = selectedAnswers[scenario.id];

  async function handleSubmit() {
    if (Object.keys(selectedAnswers).length !== SCENARIOS.length) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'conversation',
        content: JSON.stringify({
          responses: SCENARIOS.map((s) => ({
            situation: s.situation,
            selectedAnswer: s.dialogue.find((d) => d.isUser)?.options?.[
              selectedAnswers[s.id] ?? 0
            ],
          })),
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
      <div className='flex justify-between items-center mb-6'>
        <div className='flex space-x-2'>
          {SCENARIOS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScenario(index)}
              className={`px-3 py-1 rounded-md ${
                currentScenario === index
                  ? 'bg-blue-600 text-white'
                  : selectedAnswers[SCENARIOS[index].id] !== undefined
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className='text-sm text-gray-600 dark:text-gray-400'>
          {currentScenario + 1} of {SCENARIOS.length}
        </div>
      </div>

      <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg'>
        <h3 className='font-medium text-lg text-gray-900 dark:text-white mb-4'>
          Scenario: {scenario.situation}
        </h3>
        <div className='space-y-4'>
          {scenario.dialogue.map((d, index) => (
            <div key={index} className='space-y-2'>
              <div className='font-medium text-gray-700 dark:text-gray-300'>
                {d.speaker}:
              </div>
              {d.isUser ? (
                <div className='space-y-2'>
                  {d.options?.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className='flex items-start gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer'
                    >
                      <input
                        type='radio'
                        name={`scenario-${scenario.id}`}
                        checked={selectedAnswer === optionIndex}
                        onChange={() =>
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [scenario.id]: optionIndex,
                          }))
                        }
                        className='mt-1'
                      />
                      <span className='text-gray-800 dark:text-gray-200'>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className='text-gray-800 dark:text-gray-200'>{d.text}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-between items-center mt-6'>
        <button
          onClick={() => setCurrentScenario((prev) => Math.max(0, prev - 1))}
          disabled={currentScenario === 0}
          className='px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50'
        >
          Previous
        </button>

        {currentScenario === SCENARIOS.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={
              isSaving ||
              Object.keys(selectedAnswers).length !== SCENARIOS.length
            }
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
          >
            {isSaving ? 'Saving...' : 'Submit All Answers'}
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentScenario((prev) =>
                Math.min(SCENARIOS.length - 1, prev + 1)
              )
            }
            disabled={selectedAnswers[scenario.id] === undefined}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
          >
            Next
          </button>
        )}
      </div>

      {showFeedback && (
        <div className='mt-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-100 rounded-md'>
          Your responses have been submitted successfully!
        </div>
      )}
    </div>
  );
}

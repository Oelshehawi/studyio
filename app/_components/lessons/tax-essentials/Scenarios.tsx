'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface ScenariosProps {
  lessonId: string;
}

const TAX_SCENARIOS = [
  {
    title: 'New Immigrant Scenario',
    description:
      'You recently moved to BC from abroad and started working. Navigate your first tax season.',
    details: {
      background: 'Arrived in June 2023',
      employment: 'Started work in July',
      housing: 'Renting an apartment',
      income: '$45,000 (6 months)',
    },
    questions: [
      {
        type: 'text',
        question:
          'What tax forms and documents will you need to file your first return?',
        hint: 'Consider employment documents and proof of residency.',
      },
      {
        type: 'calculation',
        question: 'Calculate your estimated tax credits:',
        data: {
          'Basic Personal Amount (prorated)': 7500,
          'Climate Action Incentive (prorated)': 300,
          'GST/HST Credit (quarterly)': 125,
        },
        task: 'What is your total estimated tax credits for the year?',
      },
    ],
  },
  {
    title: 'Work from Home Scenario',
    description:
      'You worked from home for part of the year. Understand your eligible deductions.',
    details: {
      workArrangement: '3 days/week at home',
      period: '8 months in 2023',
      expenses: 'Internet, utilities, supplies',
      workspace: 'Dedicated home office',
    },
    questions: [
      {
        type: 'text',
        question:
          'What documentation do you need to claim work-from-home expenses?',
        hint: 'Think about employer forms and expense tracking.',
      },
      {
        type: 'calculation',
        question: 'Calculate your work-from-home deduction:',
        data: {
          'Days worked from home': 96,
          'Daily flat rate': 2,
          'Maximum claim': 500,
        },
        task: 'What is your total work-from-home deduction?',
      },
    ],
  },
];

export default function Scenarios({ lessonId }: ScenariosProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    const scenario = TAX_SCENARIOS[currentScenario];
    const allQuestionsAnswered = scenario.questions.every((q) =>
      answers[`${currentScenario}-${q.question}`]?.trim()
    );
    if (!allQuestionsAnswered) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'scenarios',
        content: JSON.stringify({
          type: 'tax-scenario',
          scenario: scenario.title,
          answers: scenario.questions.map((q) => ({
            question: q.question,
            answer: answers[`${currentScenario}-${q.question}`],
            type: q.type,
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

  const scenario = TAX_SCENARIOS[currentScenario];

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
        {/* Scenario Header */}
        <div className='p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='font-medium text-lg text-gray-900 dark:text-white'>
            {scenario.title}
          </h3>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1'>
            {scenario.description}
          </p>
        </div>

        {/* Scenario Details */}
        <div className='p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            {Object.entries(scenario.details).map(([key, value]) => (
              <div key={key} className='space-y-1'>
                <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </div>
                <div className='text-sm sm:text-base text-gray-900 dark:text-white'>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className='p-3 sm:p-4 space-y-4 sm:space-y-6'>
          {scenario.questions.map((q, index) => (
            <div key={index} className='space-y-3'>
              <label className='block'>
                <span className='block font-medium text-gray-900 dark:text-white mb-2'>
                  {q.question}
                </span>
                {q.type === 'calculation' && (
                  <div className='mb-4 bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-md'>
                    <div className='text-sm font-medium text-blue-800 dark:text-blue-200 mb-2'>
                      Given Values:
                    </div>
                    <div className='space-y-1'>
                      {q.data &&
                        Object.entries(q.data).map(([key, value]) => (
                          <div
                            key={key}
                            className='flex flex-col sm:flex-row justify-between text-sm text-blue-700 dark:text-blue-300'
                          >
                            <span className='font-medium'>{key}:</span>
                            <span className='ml-4'>${value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {q.hint && (
                  <div className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                    💡 Hint: {q.hint}
                  </div>
                )}
                <textarea
                  value={answers[`${currentScenario}-${q.question}`] || ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [`${currentScenario}-${q.question}`]: e.target.value,
                    }))
                  }
                  rows={4}
                  className='w-full p-2 sm:p-3 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 dark:border-gray-600'
                  placeholder='Enter your answer...'
                />
              </label>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className='p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0'>
          <button
            onClick={() => {
              setCurrentScenario((prev) => Math.max(0, prev - 1));
              setShowFeedback(false);
            }}
            disabled={currentScenario === 0}
            className='px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 order-2 sm:order-1'
          >
            Previous
          </button>
          <div className='flex gap-2 sm:gap-4 order-1 sm:order-2'>
            {!showFeedback ? (
              <button
                onClick={handleSubmit}
                disabled={
                  isSaving ||
                  !scenario.questions.every((q) =>
                    answers[`${currentScenario}-${q.question}`]?.trim()
                  )
                }
                className='w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
              >
                {isSaving ? 'Saving...' : 'Submit Answers'}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentScenario < TAX_SCENARIOS.length - 1) {
                    setCurrentScenario((prev) => prev + 1);
                    setShowFeedback(false);
                  }
                }}
                disabled={currentScenario === TAX_SCENARIOS.length - 1}
                className='w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
              >
                Next Scenario
              </button>
            )}
          </div>
        </div>

        {showFeedback && (
          <div className='p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20'>
            <div className='flex items-center gap-2 text-green-800 dark:text-green-200'>
              <svg
                className='w-5 h-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>Your answers have been saved!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

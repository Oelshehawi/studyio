'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface IncomeTaxProps {
  lessonId: string;
}

const T4_FIELDS = [
  {
    box: '14',
    title: 'Employment Income',
    description: 'Total amount of employment income before deductions',
    example: '45,000.00',
  },
  {
    box: '16',
    title: 'CPP Contributions',
    description: 'Employee contributions to Canada Pension Plan',
    example: '2,898.00',
  },
  {
    box: '18',
    title: 'EI Premiums',
    description: 'Employee Employment Insurance premiums',
    example: '952.74',
  },
  {
    box: '22',
    title: 'Income Tax Deducted',
    description: 'Total income tax deducted from your pay',
    example: '8,750.00',
  },
  {
    box: '24',
    title: 'EI Insurable Earnings',
    description: 'Earnings used to calculate EI premiums',
    example: '45,000.00',
  },
];

const SCENARIOS = [
  {
    title: "Understanding Sarah's T4",
    description:
      'Sarah is a software developer who started working in BC last year. Help her understand her T4 slip.',
    fields: {
      income: '75000.00',
      cpp: '3754.45',
      ei: '1002.45',
      tax: '15250.00',
    },
    questions: [
      {
        question: "What is Sarah's annual employment income?",
        answer: '$75,000.00',
        explanation:
          "Found in Box 14 of the T4 slip, this shows Sarah's total employment income for the year.",
      },
      {
        question: "How much income tax was deducted from Sarah's pay?",
        answer: '$15,250.00',
        explanation:
          "Box 22 shows the total income tax deducted from Sarah's paychecks throughout the year.",
      },
    ],
  },
  {
    title: "Analyzing Michael's Deductions",
    description:
      "Michael works part-time in retail. Let's examine his payroll deductions.",
    fields: {
      income: '28000.00',
      cpp: '1428.00',
      ei: '468.00',
      tax: '4200.00',
    },
    questions: [
      {
        question: "What percentage of Michael's income goes to CPP?",
        answer: '5.1%',
        explanation: 'To calculate: (1,428.00 ÷ 28,000.00) × 100 = 5.1%',
      },
      {
        question: "What is Michael's take-home pay after deductions?",
        answer: '$21,904.00',
        explanation: '28,000 - (1,428.00 + 468.00 + 4,200.00) = 21,904.00',
      },
    ],
  },
];

export default function IncomeTax({ lessonId }: IncomeTaxProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    if (userAnswers.length !== SCENARIOS[currentScenario].questions.length)
      return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'income-tax',
        content: JSON.stringify({
          type: 'income-tax-scenario',
          scenario: SCENARIOS[currentScenario].title,
          answers: SCENARIOS[currentScenario].questions.map((q, i) => ({
            question: q.question,
            userAnswer: userAnswers[i],
            correctAnswer: q.answer,
          })),
        }),
      });

      if (response.success) {
        setShowAnswers(true);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* T4 Reference Guide */}
      <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4'>
        <h3 className='font-medium text-lg text-gray-900 dark:text-white mb-3 sm:mb-4'>
          Understanding Your T4 Slip
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
          {T4_FIELDS.map((field) => (
            <div
              key={field.box}
              className='bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg'
            >
              <div className='flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3'>
                <span className='inline-flex px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded text-sm font-medium'>
                  Box {field.box}
                </span>
                <div>
                  <h4 className='font-medium text-gray-900 dark:text-white'>
                    {field.title}
                  </h4>
                  <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
                    {field.description}
                  </p>
                  <p className='text-sm text-blue-600 dark:text-blue-400 mt-2'>
                    Example: ${field.example}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Scenarios */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
        <div className='p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='font-medium text-lg text-gray-900 dark:text-white'>
            {SCENARIOS[currentScenario].title}
          </h3>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1'>
            {SCENARIOS[currentScenario].description}
          </p>
        </div>

        <div className='p-3 sm:p-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6'>
            {Object.entries(SCENARIOS[currentScenario].fields).map(
              ([key, value]) => (
                <div
                  key={key}
                  className='bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded-lg'
                >
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    {key.toUpperCase()}
                  </div>
                  <div className='text-base sm:text-lg font-medium text-gray-900 dark:text-white'>
                    ${value}
                  </div>
                </div>
              )
            )}
          </div>

          <div className='space-y-4'>
            {SCENARIOS[currentScenario].questions.map((q, index) => (
              <div key={index} className='space-y-2'>
                <label className='block text-gray-900 dark:text-white font-medium'>
                  {q.question}
                </label>
                <input
                  type='text'
                  value={userAnswers[index] || ''}
                  onChange={(e) =>
                    setUserAnswers((prev) => {
                      const newAnswers = [...prev];
                      newAnswers[index] = e.target.value;
                      return newAnswers;
                    })
                  }
                  disabled={showAnswers}
                  className='w-full p-2 sm:p-3 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 dark:border-gray-600'
                  placeholder='Enter your answer'
                />
                {showAnswers && (
                  <div className='mt-2 space-y-1'>
                    <div className='text-green-600 dark:text-green-400 font-medium'>
                      Correct Answer: {q.answer}
                    </div>
                    <div className='text-sm text-gray-600 dark:text-gray-300'>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0'>
          <button
            onClick={() => {
              setCurrentScenario((prev) => Math.max(0, prev - 1));
              setShowAnswers(false);
              setUserAnswers([]);
            }}
            disabled={currentScenario === 0}
            className='px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 order-2 sm:order-1'
          >
            Previous
          </button>
          {!showAnswers ? (
            <button
              onClick={handleSubmit}
              disabled={
                isSaving ||
                userAnswers.length !==
                  SCENARIOS[currentScenario].questions.length ||
                userAnswers.some((a) => !a)
              }
              className='w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 order-1 sm:order-2'
            >
              {isSaving ? 'Checking...' : 'Check Answers'}
            </button>
          ) : (
            <button
              onClick={() => {
                if (currentScenario < SCENARIOS.length - 1) {
                  setCurrentScenario((prev) => prev + 1);
                  setShowAnswers(false);
                  setUserAnswers([]);
                }
              }}
              disabled={currentScenario === SCENARIOS.length - 1}
              className='w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 order-1 sm:order-2'
            >
              Next Scenario
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

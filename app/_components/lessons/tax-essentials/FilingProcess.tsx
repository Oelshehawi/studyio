'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface FilingProcessProps {
  lessonId: string;
}

const FILING_STEPS = [
  {
    title: 'Gather Your Documents',
    content: [
      {
        type: 'text',
        text: 'Before starting your tax return, collect all necessary documents:',
      },
      {
        type: 'list',
        items: [
          'T4 slips from employers',
          'T5 slips for investment income',
          'Receipts for deductible expenses',
          'Notice of Assessment from last year',
          'Social Insurance Number (SIN)',
        ],
      },
      {
        type: 'tip',
        text: 'Create a folder or digital space to organize all your tax documents throughout the year.',
      },
    ],
  },
  {
    title: 'Choose Filing Method',
    content: [
      {
        type: 'text',
        text: 'There are several ways to file your taxes in Canada:',
      },
      {
        type: 'list',
        items: [
          'NETFILE: File online using certified tax software',
          'EFILE: File through a tax professional',
          'Paper filing: Mail your return to CRA',
        ],
      },
      {
        type: 'tip',
        text: 'Most people qualify for free tax software through CRA\'s Community Volunteer Income Tax Program.',
      },
    ],
  },
  {
    title: 'Complete Your Return',
    content: [
      {
        type: 'text',
        text: 'Follow these steps to complete your tax return:',
      },
      {
        type: 'list',
        items: [
          'Enter your personal information',
          'Report all income sources',
          'Claim eligible deductions and credits',
          'Calculate taxes owed or refund due',
          'Review for accuracy',
        ],
      },
      {
        type: 'tip',
        text: 'Take your time and double-check all entries. Small errors can delay processing.',
      },
    ],
  },
  {
    title: 'Submit and Track',
    content: [
      {
        type: 'text',
        text: 'After submitting your return:',
      },
      {
        type: 'list',
        items: [
          'Keep copies of all documents',
          'Note your confirmation number',
          'Track your return status online',
          'Watch for your Notice of Assessment',
        ],
      },
      {
        type: 'tip',
        text: 'Sign up for CRA My Account to easily track your return and receive documents electronically.',
      },
    ],
  },
];

const PRACTICE_SCENARIO = {
  title: 'Tax Filing Preparation',
  description: 'Help Alex prepare for filing their first tax return in Canada.',
  questions: [
    {
      question: 'Which documents should Alex gather first?',
      options: [
        'Only bank statements',
        'T4 slip and SIN number',
        'Just their passport',
        'Only rental receipts',
      ],
      correctIndex: 1,
      explanation: 'The T4 slip shows employment income and deductions, and the SIN is required for filing taxes in Canada.',
    },
    {
      question: 'What is the recommended filing method for a first-time filer?',
      options: [
        'Paper filing by mail',
        'NETFILE with certified software',
        'Hiring an expensive accountant',
        'Filing by phone',
      ],
      correctIndex: 1,
      explanation: 'NETFILE with certified software is user-friendly, often free, and provides immediate confirmation.',
    },
    {
      question: 'What should Alex do after submitting their return?',
      options: [
        'Throw away all documents',
        'Ignore any CRA communications',
        'Keep documents and track status online',
        'Start working on next year\'s return',
      ],
      correctIndex: 2,
      explanation: 'It\'s important to keep tax documents and track the return status through CRA My Account.',
    },
  ],
};

export default function FilingProcess({ lessonId }: FilingProcessProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    if (Object.keys(answers).length !== PRACTICE_SCENARIO.questions.length) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'filing',
        content: JSON.stringify({
          type: 'filing-process-quiz',
          answers: PRACTICE_SCENARIO.questions.map((q, index) => ({
            question: q.question,
            selectedAnswer: q.options[answers[index] ?? 0],
            correctAnswer: q.options[q.correctIndex],
            isCorrect: answers[index] === q.correctIndex,
          })),
        }),
      });

      if (response.success) {
        setShowResults(true);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className='space-y-6'>
      {!showQuiz ? (
        <>
          {/* Filing Steps Guide */}
          <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
            <div className='flex gap-4'>
              {/* Step Navigation */}
              <div className='w-1/3 space-y-2'>
                {FILING_STEPS.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      currentStep === index
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm'>
                        {index + 1}
                      </span>
                      <span>{step.title}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Step Content */}
              <div className='w-2/3 bg-white dark:bg-gray-800 rounded-lg p-4'>
                <h3 className='font-medium text-lg text-gray-900 dark:text-white mb-4'>
                  {FILING_STEPS[currentStep].title}
                </h3>
                <div className='space-y-4'>
                  {FILING_STEPS[currentStep].content.map((item, index) => {
                    if (item.type === 'text') {
                      return (
                        <p
                          key={index}
                          className='text-gray-600 dark:text-gray-300'
                        >
                          {item.text}
                        </p>
                      );
                    }
                    if (item.type === 'list') {
                      return (
                        <ul key={index} className='space-y-2'>
                          {item?.items?.map((listItem, itemIndex) => (
                            <li
                              key={itemIndex}
                              className='flex items-start gap-2 text-gray-600 dark:text-gray-300'
                            >
                              <span className='text-blue-500 mt-1'>•</span>
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (item.type === 'tip') {
                      return (
                        <div
                          key={index}
                          className='bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md'
                        >
                          <p className='text-yellow-800 dark:text-yellow-200 text-sm'>
                            💡 Tip: {item.text}
                          </p>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              onClick={() => setShowQuiz(true)}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              Practice Quiz
            </button>
          </div>
        </>
      ) : (
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='font-medium text-lg text-gray-900 dark:text-white'>
              {PRACTICE_SCENARIO.title}
            </h3>
            <p className='text-gray-600 dark:text-gray-300 mt-1'>
              {PRACTICE_SCENARIO.description}
            </p>
          </div>

          <div className='p-4'>
            <div className='space-y-6'>
              {PRACTICE_SCENARIO.questions.map((q, qIndex) => (
                <div key={qIndex} className='space-y-3'>
                  <h4 className='font-medium text-gray-900 dark:text-white'>
                    {q.question}
                  </h4>
                  <div className='space-y-2'>
                    {q.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`flex items-start gap-2 p-3 rounded-md cursor-pointer ${
                          showResults
                            ? oIndex === q.correctIndex
                              ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : answers[qIndex] === oIndex
                              ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <input
                          type='radio'
                          name={`question-${qIndex}`}
                          checked={answers[qIndex] === oIndex}
                          onChange={() =>
                            setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }))
                          }
                          disabled={showResults}
                          className='mt-1'
                        />
                        <span className='text-gray-800 dark:text-gray-200'>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {showResults && (
                    <div className='mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md'>
                      <p className='text-blue-800 dark:text-blue-200'>
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between'>
            <button
              onClick={() => {
                setShowQuiz(false);
                setShowResults(false);
                setAnswers({});
              }}
              className='px-4 py-2 text-gray-600 dark:text-gray-400'
            >
              Back to Guide
            </button>
            {!showResults && (
              <button
                onClick={handleSubmit}
                disabled={
                  isSaving ||
                  Object.keys(answers).length !==
                    PRACTICE_SCENARIO.questions.length
                }
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
              >
                {isSaving ? 'Checking...' : 'Check Answers'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
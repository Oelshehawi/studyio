'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface DeductionsProps {
  lessonId: string;
}

const DEDUCTIONS_INFO = [
  {
    category: 'Common Tax Credits',
    items: [
      {
        name: 'Basic Personal Amount',
        description: 'A non-refundable tax credit that everyone can claim',
        details:
          'For 2023, the maximum amount is $15,000. This reduces your taxable income.',
      },
      {
        name: 'GST/HST Credit',
        description: 'Quarterly payments to help offset sales taxes',
        details:
          'Amount depends on income and family size. You need to file taxes to receive it.',
      },
      {
        name: 'Climate Action Incentive',
        description: 'Helps offset the cost of federal pollution pricing',
        details:
          'Paid quarterly to eligible residents of BC and other participating provinces.',
      },
    ],
  },
  {
    category: 'Work-Related Deductions',
    items: [
      {
        name: 'Work From Home Expenses',
        description: 'Deductions for home office expenses',
        details:
          'Can claim either a flat rate or detailed expenses with Form T2200.',
      },
      {
        name: 'Professional Dues',
        description: 'Membership fees for professional organizations',
        details: 'Must be required for your employment to be deductible.',
      },
    ],
  },
  {
    category: 'Housing-Related Credits',
    items: [
      {
        name: 'First-Time Home Buyers Amount',
        description: 'Credit for first-time home buyers',
        details: 'Worth up to $5,000 if you bought your first home this year.',
      },
      {
        name: 'Home Accessibility Expenses',
        description: 'Renovations to make homes safer or more accessible',
        details:
          'Available for seniors and those eligible for disability tax credit.',
      },
    ],
  },
];

const CASE_STUDIES = [
  {
    title: 'New Immigrant Work Scenario',
    description:
      'Maria recently moved to BC and started working remotely. Help her identify eligible tax benefits.',
    details: {
      income: '$60,000/year',
      situation: 'Works from home 3 days/week',
      status: 'Permanent Resident',
    },
    questions: [
      {
        question: 'Which tax credits should Maria definitely apply for?',
        options: [
          'Basic Personal Amount and Climate Action Incentive',
          'Only GST/HST Credit',
          'First-Time Home Buyers Amount',
          'Home Accessibility Credit',
        ],
        correctIndex: 0,
        explanation:
          'As a resident of BC, Maria is eligible for the Basic Personal Amount and Climate Action Incentive. Her income also makes her eligible for the GST/HST Credit.',
      },
      {
        question: 'What work-related expenses could Maria potentially claim?',
        options: [
          'Only professional dues',
          'Work from home expenses using the flat rate method',
          'Home Accessibility Expenses',
          'First-Time Home Buyers Amount',
        ],
        correctIndex: 1,
        explanation:
          'Since Maria works from home regularly, she can claim work from home expenses using the simplified flat rate method.',
      },
    ],
  },
];

export default function Deductions({ lessonId }: DeductionsProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    if (Object.keys(answers).length !== CASE_STUDIES[0].questions.length)
      return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'deductions',
        content: JSON.stringify({
          type: 'deductions-case-study',
          caseStudy: CASE_STUDIES[0].title,
          answers: CASE_STUDIES[0].questions.map((q, index) => ({
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
      {!showCaseStudy ? (
        <>
          {/* Credits and Deductions Guide */}
          <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
            <div className='flex gap-4'>
              {/* Categories */}
              <div className='w-1/3'>
                {DEDUCTIONS_INFO.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(index)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      selectedCategory === index
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {category.category}
                  </button>
                ))}
              </div>

              {/* Details */}
              <div className='w-2/3 bg-white dark:bg-gray-800 rounded-lg p-4'>
                <h3 className='font-medium text-lg text-gray-900 dark:text-white mb-4'>
                  {DEDUCTIONS_INFO[selectedCategory].category}
                </h3>
                <div className='space-y-4'>
                  {DEDUCTIONS_INFO[selectedCategory].items.map(
                    (item, index) => (
                      <div
                        key={index}
                        className='border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0'
                      >
                        <h4 className='font-medium text-gray-900 dark:text-white'>
                          {item.name}
                        </h4>
                        <p className='text-gray-600 dark:text-gray-300 mt-1'>
                          {item.description}
                        </p>
                        <p className='text-sm text-blue-600 dark:text-blue-400 mt-2'>
                          {item.details}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              onClick={() => setShowCaseStudy(true)}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              Practice Case Study
            </button>
          </div>
        </>
      ) : (
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='font-medium text-lg text-gray-900 dark:text-white'>
              {CASE_STUDIES[0].title}
            </h3>
            <p className='text-gray-600 dark:text-gray-300 mt-1'>
              {CASE_STUDIES[0].description}
            </p>
          </div>

          <div className='p-4'>
            {/* Scenario Details */}
            <div className='grid gap-4 sm:grid-cols-3 mb-6'>
              {Object.entries(CASE_STUDIES[0].details).map(([key, value]) => (
                <div
                  key={key}
                  className='bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg'
                >
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                  <div className='font-medium text-gray-900 dark:text-white'>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Questions */}
            <div className='space-y-6'>
              {CASE_STUDIES[0].questions.map((q, qIndex) => (
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
                            setAnswers((prev) => ({
                              ...prev,
                              [qIndex]: oIndex,
                            }))
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
                setShowCaseStudy(false);
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
                    CASE_STUDIES[0].questions.length
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

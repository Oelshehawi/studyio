'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface TaxBasicsProps {
  lessonId: string;
}

const TAX_TERMS = [
  {
    term: 'T4 Slip',
    definition:
      'A form showing your employment income and deductions for the year.',
    example:
      'Your employer will provide you with a T4 slip by the end of February.',
  },
  {
    term: 'Tax Return',
    definition:
      'The form you file to report your income and calculate taxes owed or refund due.',
    example: 'Remember to file your tax return by April 30th.',
  },
  {
    term: 'Notice of Assessment',
    definition:
      'A document from CRA summarizing your tax return and any changes made.',
    example:
      'Check your Notice of Assessment to see if you have any tax credits available.',
  },
  {
    term: 'Tax Bracket',
    definition: 'Income range that determines your tax rate.',
    example: 'If you earn more, you might move into a higher tax bracket.',
  },
  {
    term: 'GST/HST Credit',
    definition:
      'A tax-free payment helping individuals with low income offset sales taxes.',
    example: 'You may receive GST/HST credit payments every quarter.',
  },
];

const PRACTICE_QUESTIONS = [
  {
    question: "What's the purpose of a T4 slip?",
    options: [
      'Shows your employment income and deductions',
      'Lists your grocery expenses',
      'Shows your travel history',
      'Records your work schedule',
    ],
    correctIndex: 0,
  },
  {
    question: 'When is the typical deadline for filing your tax return?',
    options: ['December 31st', 'March 1st', 'April 30th', 'May 15th'],
    correctIndex: 2,
  },
  {
    question: 'What information does a Notice of Assessment provide?',
    options: [
      'Your work schedule',
      'Your shopping history',
      'A summary of your tax return and any changes',
      'Your travel plans',
    ],
    correctIndex: 2,
  },
];

export default function TaxBasics({ lessonId }: TaxBasicsProps) {
  const [selectedTerm, setSelectedTerm] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    if (Object.keys(answers).length !== PRACTICE_QUESTIONS.length) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'tax-basics',
        content: JSON.stringify({
          type: 'tax-basics-quiz',
          answers: PRACTICE_QUESTIONS.map((_, index) => ({
            question: PRACTICE_QUESTIONS[index].question,
            selectedAnswer:
              PRACTICE_QUESTIONS[index].options[answers[index] ?? 0],
            isCorrect:
              answers[index] === PRACTICE_QUESTIONS[index].correctIndex,
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

  const correctAnswers = Object.entries(answers).filter(
    ([index, answer]) =>
      answer === PRACTICE_QUESTIONS[Number(index)].correctIndex
  ).length;

  return (
    <div className='space-y-6'>
      {!showQuiz ? (
        <>
          <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'>
            <h3 className='font-medium text-lg text-gray-900 dark:text-white mb-4'>
              Essential Tax Terms
            </h3>
            <div className='flex gap-4'>
              <div className='w-1/3 space-y-2'>
                {TAX_TERMS.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTerm(index)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedTerm === index
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {term.term}
                  </button>
                ))}
              </div>
              <div className='w-2/3 bg-white dark:bg-gray-800 rounded-lg p-4'>
                <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                  {TAX_TERMS[selectedTerm].term}
                </h4>
                <p className='text-gray-600 dark:text-gray-300 mb-4'>
                  {TAX_TERMS[selectedTerm].definition}
                </p>
                <div className='bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md'>
                  <p className='text-purple-800 dark:text-purple-200 text-sm'>
                    Example: {TAX_TERMS[selectedTerm].example}
                  </p>
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
        <div className='space-y-6'>
          {PRACTICE_QUESTIONS.map((question, qIndex) => (
            <div
              key={qIndex}
              className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4'
            >
              <h3 className='font-medium text-gray-900 dark:text-white mb-4'>
                {question.question}
              </h3>
              <div className='space-y-2'>
                {question.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-start gap-2 p-3 rounded-md cursor-pointer ${
                      showResults
                        ? oIndex === question.correctIndex
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
            </div>
          ))}

          {!showResults ? (
            <div className='flex justify-end'>
              <button
                onClick={handleSubmit}
                disabled={
                  isSaving ||
                  Object.keys(answers).length !== PRACTICE_QUESTIONS.length
                }
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
              >
                {isSaving ? 'Submitting...' : 'Submit Answers'}
              </button>
            </div>
          ) : (
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
              <h4 className='font-medium text-blue-900 dark:text-blue-100 mb-2'>
                Quiz Results
              </h4>
              <p className='text-blue-800 dark:text-blue-200'>
                You got {correctAnswers} out of {PRACTICE_QUESTIONS.length}{' '}
                questions correct!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface VocabularySectionProps {
  lessonId: string;
}

interface MatchingExercise {
  type: 'matching';
  title: string;
  content: Array<{
    phrase: string;
    usage: string;
  }>;
}

interface FillInBlankExercise {
  type: 'fillInBlank';
  title: string;
  content: Array<{
    phrase: string;
    example: string;
  }>;
}

interface MultipleChoiceExercise {
  type: 'multipleChoice';
  title: string;
  content: Array<{
    phrase: string;
    correctContext: string;
    options: string[];
  }>;
}

export default function VocabularySection({
  lessonId,
}: VocabularySectionProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState<{
    [key: number]: string[];
  }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const exercises = [
    {
      type: 'matching' as const,
      title: 'Meeting Vocabulary',
      content: [
        {
          phrase: "Let's get started",
          usage: 'Opening a meeting',
        },
        {
          phrase: 'To summarize',
          usage: 'Concluding main points',
        },
        {
          phrase: 'Any questions?',
          usage: 'Inviting participation',
        },
        {
          phrase: 'Moving on to',
          usage: 'Transitioning topics',
        },
      ],
    },
    {
      type: 'fillInBlank' as const,
      title: 'Email Phrases',
      content: [
        {
          phrase: 'I am writing to',
          example: '_____ request your feedback on the latest proposal.',
        },
        {
          phrase: 'I look forward to',
          example: '_____ hearing from you soon.',
        },
        {
          phrase: 'Please find attached',
          example: '_____ the updated project timeline.',
        },
        {
          phrase: 'Thank you for your',
          example: '_____ prompt attention to this matter.',
        },
      ],
    },
    {
      type: 'multipleChoice' as const,
      title: 'Professional Small Talk',
      content: [
        {
          phrase: 'How are things going with the project?',
          correctContext: 'Showing interest in work progress',
          options: [
            'Showing interest in work progress',
            'Complaining about work',
            'Discussing personal matters',
            'Making a demand',
          ],
        },
        {
          phrase: "I heard you're working on something new",
          correctContext: 'Starting a professional conversation',
          options: [
            'Starting a professional conversation',
            'Spreading office gossip',
            'Making an accusation',
            'Giving an order',
          ],
        },
        {
          phrase: 'That sounds challenging',
          correctContext: 'Showing empathy professionally',
          options: [
            'Showing empathy professionally',
            'Expressing doubt',
            'Being negative',
            'Avoiding responsibility',
          ],
        },
      ],
    },
  ];

  const isExerciseComplete = (exerciseIndex: number) => {
    const answers = exerciseAnswers[exerciseIndex] || [];
    const exercise = exercises[exerciseIndex];
    return (
      answers.length === exercise.content.length &&
      answers.every((answer) => answer && answer.trim() !== '')
    );
  };

  const canProceed = isExerciseComplete(currentExercise);
  const isAllComplete = exercises.every((_, index) =>
    isExerciseComplete(index)
  );

  async function handleSubmit() {
    if (!isAllComplete) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'vocabulary',
        content: JSON.stringify({
          exercises: exercises.map((exercise, index) => ({
            type: exercise.type,
            answers: exerciseAnswers[index] || [],
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

  function handleNext() {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise((prev) => prev + 1);
    }
  }

  function handlePrevious() {
    if (currentExercise > 0) {
      setCurrentExercise((prev) => prev - 1);
    }
  }

  function updateAnswers(answers: string[]) {
    setExerciseAnswers((prev) => ({
      ...prev,
      [currentExercise]: answers,
    }));
  }

  function renderExercise() {
    const exercise = exercises[currentExercise];
    const currentAnswers = exerciseAnswers[currentExercise] || [];

    switch (exercise.type) {
      case 'matching': {
        const matchingContent = exercise.content as MatchingExercise['content'];
        return (
          <div className='space-y-4'>
            <h3 className='font-medium text-lg text-gray-900'>
              {exercise.title}
            </h3>
            <div className='grid gap-4'>
              {matchingContent.map((item, index) => (
                <div key={index} className='flex flex-col space-y-2'>
                  <p className='font-medium text-gray-800'>{item.phrase}</p>
                  <select
                    value={currentAnswers[index] || ''}
                    className='p-2 border rounded-md text-gray-900'
                    onChange={(e) => {
                      const newAnswers = [...currentAnswers];
                      newAnswers[index] = e.target.value;
                      updateAnswers(newAnswers);
                    }}
                  >
                    <option value=''>Select usage...</option>
                    {matchingContent.map((option, i) => (
                      <option
                        key={i}
                        value={option.usage}
                        className='text-gray-900'
                      >
                        {option.usage}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'fillInBlank': {
        const fillInBlankContent =
          exercise.content as FillInBlankExercise['content'];
        return (
          <div className='space-y-4'>
            <h3 className='font-medium text-lg text-gray-900'>
              {exercise.title}
            </h3>
            <div className='grid gap-4'>
              {fillInBlankContent.map((item, index) => (
                <div key={index} className='space-y-2'>
                  <p className='text-gray-800'>{item.example}</p>
                  <input
                    type='text'
                    value={currentAnswers[index] || ''}
                    className='w-full p-2 border rounded-md text-gray-900'
                    placeholder='Type the missing phrase'
                    onChange={(e) => {
                      const newAnswers = [...currentAnswers];
                      newAnswers[index] = e.target.value;
                      updateAnswers(newAnswers);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'multipleChoice': {
        const multipleChoiceContent =
          exercise.content as MultipleChoiceExercise['content'];
        return (
          <div className='space-y-4'>
            <h3 className='font-medium text-lg text-gray-900'>
              {exercise.title}
            </h3>
            <div className='grid gap-6'>
              {multipleChoiceContent.map((item, index) => (
                <div key={index} className='space-y-2'>
                  <p className='font-medium text-gray-800'>
                    When would you use: &quot;{item.phrase}&quot;?
                  </p>
                  <div className='grid gap-2'>
                    {item.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className='flex items-center space-x-2'
                      >
                        <input
                          type='radio'
                          name={`question-${index}`}
                          value={option}
                          checked={currentAnswers[index] === option}
                          onChange={(e) => {
                            const newAnswers = [...currentAnswers];
                            newAnswers[index] = e.target.value;
                            updateAnswers(newAnswers);
                          }}
                          className='text-blue-600'
                        />
                        <span className='text-gray-700'>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex space-x-2'>
          {exercises.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentExercise(index)}
              className={`px-3 py-1 rounded-md ${
                currentExercise === index
                  ? 'bg-blue-600 text-white'
                  : isExerciseComplete(index)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className='text-sm text-gray-600'>
          {currentExercise + 1} of {exercises.length}
        </div>
      </div>

      {renderExercise()}

      <div className='flex justify-between items-center mt-6'>
        <button
          onClick={handlePrevious}
          disabled={currentExercise === 0}
          className='px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50'
        >
          Previous
        </button>

        {currentExercise === exercises.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!isAllComplete || isSaving}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
          >
            {isSaving ? 'Saving...' : 'Submit All Answers'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
          >
            Next
          </button>
        )}
      </div>

      {showFeedback && (
        <div className='mt-4 p-4 bg-green-50 text-green-800 rounded-md'>
          Your answers have been saved successfully!
        </div>
      )}
    </div>
  );
}

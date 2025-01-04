'use client';

import { useState } from 'react';
import { saveResponse } from '@/lib/actions';

interface WatchSectionProps {
  lessonId: string;
  sectionId: string;
  videoId: string;
  title: string;
  keyPoints: string[];
  tips: string[];
  quiz?: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
    }>;
  };
}

export default function WatchSection({
  lessonId,
  sectionId,
  videoId,
  title,
  keyPoints,
  tips,
  quiz,
}: WatchSectionProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    if (!quiz || selectedAnswers.length !== quiz.questions.length) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId,
        content: JSON.stringify({
          type: 'video-quiz',
          answers: quiz.questions.map((q, i) => ({
            question: q.question,
            selectedAnswer: selectedAnswers[i],
            correctAnswer: q.correctAnswer,
            isCorrect: selectedAnswers[i] === q.correctAnswer,
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
    <div className='space-y-4 sm:space-y-6'>
      <div className='aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden'>
        <iframe
          className='w-full h-full'
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      </div>

      <div className='space-y-4'>
        <h3 className='font-medium text-lg text-gray-900 dark:text-white'>
          Key Points to Remember:
        </h3>
        <ul className='list-disc list-inside space-y-2 text-gray-800 dark:text-gray-200'>
          {keyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      <div className='bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg'>
        <h4 className='font-medium text-blue-900 dark:text-blue-100 mb-2'>
          Pro Tips 💡
        </h4>
        <ul className='list-none space-y-2 text-blue-800 dark:text-blue-200'>
          {tips.map((tip, index) => (
            <li key={index}>• {tip}</li>
          ))}
        </ul>
      </div>

      {quiz && !showQuiz && (
        <button
          onClick={() => setShowQuiz(true)}
          className='w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Take Quiz
        </button>
      )}

      {quiz && showQuiz && (
        <div className='space-y-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4'>
          <h3 className='font-medium text-lg text-gray-900 dark:text-white mb-4'>
            Video Comprehension Quiz
          </h3>
          <div className='space-y-6'>
            {quiz.questions.map((q, qIndex) => (
              <div key={qIndex} className='space-y-3'>
                <p className='font-medium text-gray-900 dark:text-white'>
                  {q.question}
                </p>
                <div className='space-y-2'>
                  {q.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className='flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer'
                    >
                      <input
                        type='radio'
                        name={`question-${qIndex}`}
                        value={option}
                        checked={selectedAnswers[qIndex] === option}
                        onChange={() => {
                          const newAnswers = [...selectedAnswers];
                          newAnswers[qIndex] = option;
                          setSelectedAnswers(newAnswers);
                        }}
                        disabled={showResults}
                        className='mt-1'
                      />
                      <span className='text-gray-700 dark:text-gray-300'>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
                {showResults && (
                  <div
                    className={`p-3 rounded-lg ${
                      selectedAnswers[qIndex] === q.correctAnswer
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                    }`}
                  >
                    {selectedAnswers[qIndex] === q.correctAnswer ? (
                      <p>✓ Correct!</p>
                    ) : (
                      <p>
                        ✗ Incorrect. The correct answer is: {q.correctAnswer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!showResults && (
            <button
              onClick={handleSubmit}
              disabled={
                isSaving ||
                selectedAnswers.length !== quiz.questions.length ||
                selectedAnswers.some((a) => !a)
              }
              className='w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4'
            >
              {isSaving ? 'Submitting...' : 'Submit Answers'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

import { getUserResponses } from '@/lib/actions';

interface VocabularyExercise {
  type: 'matching' | 'fillInBlank' | 'multipleChoice';
  answers: string[];
}

interface VocabularySubmission {
  exercises: VocabularyExercise[];
}

interface CasualConversationResponse {
  responses?: Array<{
    situation: string;
    selectedAnswer: string;
  }>;
  prompt?: string;
  story?: string;
  topic?: string;
  question?: string;
  opinion?: string;
  type?: 'conversation' | 'story' | 'opinion';
}

interface Response {
  _id: string;
  content: string;
  createdAt: string;
}

interface TaxQuizAnswer {
  question: string;
  selectedAnswer: string;
  correctAnswer?: string;
  isCorrect: boolean;
}

interface TaxIncomeProblem {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

interface TaxScenarioAnswer {
  question: string;
  answer: string;
  type: 'text' | 'calculation';
}

interface TaxSubmission {
  type: string;
  answers?: TaxQuizAnswer[] | TaxIncomeProblem[] | TaxScenarioAnswer[];
  'case Study'?: string;
  scenario?: string;
}

interface VideoQuizAnswer {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface VideoQuizSubmission {
  type: 'video-quiz';
  answers: VideoQuizAnswer[];
}

function formatVocabularyResponse(content: string) {
  try {
    const data = JSON.parse(content) as VocabularySubmission;
    const exercises = data.exercises;

    if (!exercises) return content;

    return (
      <div className='space-y-4'>
        {exercises.map((exercise, index) => {
          const exerciseTitle =
            exercise.type === 'matching'
              ? 'Meeting Vocabulary'
              : exercise.type === 'fillInBlank'
              ? 'Email Phrases'
              : 'Professional Small Talk';

          return (
            <div key={index} className='space-y-2'>
              <h4 className='font-medium text-gray-900 dark:text-white'>
                {exerciseTitle}
              </h4>
              {exercise.type === 'matching' && (
                <div className='grid gap-2'>
                  {[
                    "Let's get started",
                    'To summarize',
                    'Any questions?',
                    'Moving on to',
                  ].map((phrase, i) => (
                    <div
                      key={i}
                      className='flex items-center gap-2 text-gray-700 dark:text-gray-300'
                    >
                      <span className='font-medium'>{phrase}:</span>
                      <span>{exercise.answers[i]}</span>
                    </div>
                  ))}
                </div>
              )}
              {exercise.type === 'fillInBlank' && (
                <div className='grid gap-2'>
                  {[
                    'I am writing to',
                    'I look forward to',
                    'Please find attached',
                    'Thank you for your',
                  ].map((phrase, i) => (
                    <div
                      key={i}
                      className='flex items-center gap-2 text-gray-700 dark:text-gray-300'
                    >
                      <span className='font-medium'>{phrase}</span>
                      <span>{exercise.answers[i]}</span>
                    </div>
                  ))}
                </div>
              )}
              {exercise.type === 'multipleChoice' && (
                <div className='grid gap-2'>
                  {[
                    'How are things going with the project?',
                    "I heard you're working on something new",
                    'That sounds challenging',
                  ].map((phrase, i) => (
                    <div
                      key={i}
                      className='flex items-center gap-2 text-gray-700 dark:text-gray-300'
                    >
                      <span className='font-medium'>{phrase}:</span>
                      <span>{exercise.answers[i]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  } catch {
    return content;
  }
}

function formatAudioResponse(content: string) {
  try {
    const data = JSON.parse(content);
    return (
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3'>
        <div className='w-full sm:flex-1 bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700'>
          <audio
            controls
            src={data.audio}
            className='w-full h-8'
            controlsList='nodownload noplaybackrate'
          />
        </div>
        <span className='text-sm text-gray-600 dark:text-gray-400 font-medium px-2'>
          {data.duration ? `${Math.round(data.duration)}s` : ''}
        </span>
      </div>
    );
  } catch {
    return content;
  }
}

function formatEmailResponse(content: string) {
  try {
    const [subjectLine, ...bodyLines] = content.split('\n');
    const subject = subjectLine.startsWith('Subject:')
      ? subjectLine.substring(8).trim()
      : '';
    const body = bodyLines.join('\n').trim();

    return (
      <div className='space-y-3 text-gray-800 dark:text-gray-200'>
        {subject && (
          <div>
            <span className='font-medium'>Subject: </span>
            <span>{subject}</span>
          </div>
        )}
        <p className='whitespace-pre-wrap'>{body}</p>
      </div>
    );
  } catch {
    return content;
  }
}

function formatCasualConversationResponse(data: CasualConversationResponse) {
  try {
    if (data.type === 'conversation' && data.responses) {
      return (
        <div className='space-y-3'>
          <h4 className='font-medium text-gray-900 dark:text-white'>
            Conversation Responses
          </h4>
          <div className='space-y-2'>
            {data.responses.map((response, index) => (
              <div key={index} className='space-y-1'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {response.situation}
                </p>
                <p className='text-gray-900 dark:text-white'>
                  {response.selectedAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.type === 'story' && data.prompt && data.story) {
      return (
        <div className='space-y-3'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {data.prompt}
          </p>
          <p className='text-gray-900 dark:text-white whitespace-pre-wrap'>
            {data.story}
          </p>
        </div>
      );
    }

    if (
      data.type === 'opinion' &&
      data.topic &&
      data.question &&
      data.opinion
    ) {
      return (
        <div className='space-y-3'>
          <div>
            <span className='font-medium text-gray-900 dark:text-white'>
              Topic:{' '}
            </span>
            <span className='text-gray-700 dark:text-gray-300'>
              {data.topic}
            </span>
          </div>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {data.question}
          </p>
          <p className='text-gray-900 dark:text-white whitespace-pre-wrap'>
            {data.opinion}
          </p>
        </div>
      );
    }

    return JSON.stringify(data);
  } catch {
    return JSON.stringify(data);
  }
}

function formatTaxTalkResponse(content: string) {
  try {
    const data = JSON.parse(content) as TaxSubmission;

    // Keep existing quiz handler
    if (data.type?.endsWith('-quiz') && Array.isArray(data.answers)) {
      // Ensure we're dealing with quiz answers
      const quizAnswers = data.answers as TaxQuizAnswer[];
      if (
        !quizAnswers.every(
          (answer) => 'selectedAnswer' in answer && 'isCorrect' in answer
        )
      ) {
        return content;
      }

      return (
        <div className='space-y-4'>
          <h4 className='font-medium text-gray-900 dark:text-white'>
            Quiz Responses
          </h4>
          <div className='space-y-3'>
            {quizAnswers.map((answer, index) => (
              <div key={index} className='space-y-1'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {answer.question}
                </p>
                <div className='flex items-center gap-2'>
                  <p
                    className={`${
                      answer.isCorrect
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {answer.selectedAnswer}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      answer.isCorrect
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Handle income tax scenarios
    if (data.type === 'income-tax-scenario' && Array.isArray(data.answers)) {
      const answers = data.answers as TaxIncomeProblem[];
      return (
        <div className='space-y-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
            <h4 className='font-medium text-gray-900 dark:text-white'>
              Scenario:
            </h4>
            <span className='text-gray-700 dark:text-gray-300'>
              {data.scenario}
            </span>
          </div>
          <div className='space-y-3'>
            {answers.map((answer, index) => (
              <div
                key={index}
                className='space-y-2 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'
              >
                <p className='text-gray-900 dark:text-white'>
                  {answer.question}
                </p>
                <div className='space-y-2 sm:space-y-1.5'>
                  <div className='flex flex-col sm:flex-row items-start gap-1 sm:gap-2'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      Your answer:
                    </span>
                    <p className='text-gray-700 dark:text-gray-300'>
                      {answer.userAnswer}
                    </p>
                  </div>
                  <div className='flex flex-col sm:flex-row items-start gap-1 sm:gap-2'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      Correct answer:
                    </span>
                    <p className='text-green-600 dark:text-green-400'>
                      {answer.correctAnswer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Handle deductions case study
    if (data.type === 'deductions-case-study' && Array.isArray(data.answers)) {
      const answers = data.answers as TaxQuizAnswer[];
      return (
        <div className='space-y-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
            <h4 className='font-medium text-gray-900 dark:text-white'>
              Case Study:
            </h4>
            <span className='text-gray-700 dark:text-gray-300'>
              {data['case Study']}
            </span>
          </div>
          <div className='space-y-3'>
            {answers.map((answer, index) => (
              <div
                key={index}
                className='space-y-2 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'
              >
                <p className='text-gray-900 dark:text-white'>
                  {answer.question}
                </p>
                <div className='space-y-2 sm:space-y-1.5'>
                  <div className='flex flex-col sm:flex-row items-start gap-1 sm:gap-2'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      Your answer:
                    </span>
                    <p
                      className={`${
                        answer.isCorrect
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {answer.selectedAnswer}
                    </p>
                  </div>
                  {!answer.isCorrect && (
                    <div className='flex flex-col sm:flex-row items-start gap-1 sm:gap-2'>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        Correct answer:
                      </span>
                      <p className='text-green-600 dark:text-green-400'>
                        {answer.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Handle tax scenarios
    if (data.type === 'tax-scenario' && Array.isArray(data.answers)) {
      const answers = data.answers as TaxScenarioAnswer[];
      return (
        <div className='space-y-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
            <h4 className='font-medium text-gray-900 dark:text-white'>
              Scenario:
            </h4>
            <span className='text-gray-700 dark:text-gray-300'>
              {data.scenario}
            </span>
          </div>
          <div className='space-y-3'>
            {answers.map((answer, index) => (
              <div
                key={index}
                className='space-y-2 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'
              >
                <p className='text-gray-900 dark:text-white'>
                  {answer.question}
                </p>
                <div className='flex flex-col sm:flex-row items-start gap-1 sm:gap-2'>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Your {answer.type}:
                  </span>
                  <p className='text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
                    {answer.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Fallback for unhandled types
    return (
      <div className='space-y-3'>
        <pre className='text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-x-auto'>
          {content}
        </pre>
      </div>
    );
  } catch {
    return content;
  }
}

function formatVideoQuizResponse(content: string) {
  try {
    const data = JSON.parse(content) as VideoQuizSubmission;
    return (
      <div className='space-y-4'>
        <h4 className='font-medium text-gray-900 dark:text-white'>
          Video Quiz Results
        </h4>
        <div className='space-y-3'>
          {data.answers.map((answer, index) => (
            <div
              key={index}
              className='space-y-2 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'
            >
              <p className='text-gray-900 dark:text-white'>{answer.question}</p>
              <div className='space-y-2 sm:space-y-1.5'>
                <div className='flex flex-col sm:flex-row items-start gap-1 sm:gap-2'>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Your answer:
                  </span>
                  <p
                    className={`${
                      answer.isCorrect
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {answer.selectedAnswer}
                  </p>
                </div>
                {!answer.isCorrect && (
                  <div className='flex flex-col sm:flex-row items-start gap-1 sm:gap-2'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      Correct answer:
                    </span>
                    <p className='text-green-600 dark:text-green-400'>
                      {answer.correctAnswer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch {
    return content;
  }
}

function formatResponse(content: string, sectionId: string, lessonId: string) {
  // Professional Communication sections
  if (lessonId === 'professional-communication-1') {
    switch (sectionId) {
      case 'vocabulary':
        return formatVocabularyResponse(content);
      case 'speaking':
        return formatAudioResponse(content);
      case 'email-writing':
        return formatEmailResponse(content);
      case 'watch':
        return formatVideoQuizResponse(content);
      default:
        return content;
    }
  }

  // Casual Conversation sections
  if (lessonId === 'casual-conversation-1') {
    switch (sectionId) {
      case 'conversation':
        return formatCasualConversationResponse({
          ...JSON.parse(content),
          type: 'conversation',
        });
      case 'storytelling':
        return formatCasualConversationResponse({
          ...JSON.parse(content),
          type: 'story',
        });
      case 'opinion':
        return formatCasualConversationResponse({
          ...JSON.parse(content),
          type: 'opinion',
        });
      case 'speaking':
        return formatAudioResponse(content);
      case 'watch':
        return formatVideoQuizResponse(content);
      default:
        return content;
    }
  }

  // Tax Essentials sections
  if (lessonId === 'tax-essentials-1') {
    switch (sectionId) {
      case 'tax-basics':
      case 'income-tax':
      case 'deductions':
      case 'filing':
      case 'scenarios':
        return formatTaxTalkResponse(content);
      default:
        return content;
    }
  }

  return content;
}

export default async function SavedResponses({
  lessonId,
  sectionId,
}: {
  lessonId: string;
  sectionId: string;
}) {
  const responses = await getUserResponses(lessonId, sectionId);

  if (!responses?.length) {
    return null;
  }

  return (
    <div className='mt-6 space-y-6 text-black dark:text-white'>
      <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
        Your Submissions
      </h3>
      <div className='space-y-4'>
        {responses.map((response: Response) => (
          <div
            key={response._id}
            className='p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700'
          >
            <div className='flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4'>
              <div className='w-full sm:flex-1 min-w-0'>
                {formatResponse(response.content || '', sectionId, lessonId)}
              </div>
              <time className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                {new Date(response.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

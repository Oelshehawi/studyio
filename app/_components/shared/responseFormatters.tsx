interface VocabularyExercise {
  type: 'matching' | 'fillInBlank' | 'multipleChoice';
  answers: string[];
}

interface ConversationResponse {
  situation: string;
  selectedAnswer: string;
}

function formatVocabularyResponse(content: string) {
  try {
    const data = JSON.parse(content);
    const exercises = data.exercises;

    if (!exercises) return content;

    return (
      <div className='space-y-4'>
        {exercises.map((exercise: VocabularyExercise, index: number) => {
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
              {exercise.answers.map((answer, i) => (
                <div key={i} className='text-gray-700 dark:text-gray-300'>
                  {answer}
                </div>
              ))}
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

function formatCasualConversationResponse(content: string) {
  try {
    const data = JSON.parse(content);

    if (data.responses) {
      return (
        <div className='space-y-3'>
          <div className='space-y-2'>
            {(data.responses as ConversationResponse[]).map(
              (response, index) => (
                <div key={index} className='space-y-1'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {response.situation}
                  </p>
                  <p className='text-gray-900 dark:text-white'>
                    {response.selectedAnswer}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      );
    }

    if (data.prompt && data.story) {
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

    if (data.topic && data.question && data.opinion) {
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

    return content;
  } catch {
    return content;
  }
}

export function formatResponse(
  content: string,
  sectionId: string,
  lessonId: string
) {
  if (lessonId === 'professional-communication-1') {
    switch (sectionId) {
      case 'vocabulary':
        return formatVocabularyResponse(content);
      case 'speaking':
        return formatAudioResponse(content);
      case 'email-writing':
        return formatEmailResponse(content);
      default:
        return <div className='whitespace-pre-wrap'>{content}</div>;
    }
  }

  if (lessonId === 'casual-conversation-1') {
    switch (sectionId) {
      case 'conversation':
      case 'storytelling':
      case 'opinion':
        return formatCasualConversationResponse(content);
      case 'speaking':
        return formatAudioResponse(content);
      default:
        return <div className='whitespace-pre-wrap'>{content}</div>;
    }
  }

  return <div className='whitespace-pre-wrap'>{content}</div>;
}

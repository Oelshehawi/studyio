import { getUserResponses } from '@/lib/actions';

interface VocabularyExercise {
  type: 'matching' | 'fillInBlank' | 'multipleChoice';
  answers: string[];
}

interface VocabularySubmission {
  exercises: VocabularyExercise[];
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

function formatResponse(content: string, sectionId: string) {
  if (sectionId === 'vocabulary') {
    return formatVocabularyResponse(content);
  }
  if (sectionId === 'speaking') {
    return formatAudioResponse(content);
  }
  if (sectionId === 'email-writing' || sectionId === 'email') {
    return formatEmailResponse(content);
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
        {responses.map((response) => (
          <div
            key={response._id}
            className='p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700'
          >
            <div className='flex justify-between items-start gap-4'>
              <div className='flex-1 min-w-0'>
                {formatResponse(response.content || '', sectionId)}
              </div>
              <time className='text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                {new Date(response.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

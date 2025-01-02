import { getUserResponses } from '@/lib/actions';

interface Response {
  _id: string;
  content: string;
  lessonId: string;
  sectionId: string;
  userId: string;
  audioUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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
              <h4 className='font-medium text-gray-900'>{exerciseTitle}</h4>
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
                      className='flex items-center gap-2 text-gray-700'
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
                      className='flex items-center gap-2 text-gray-700'
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
                      className='flex items-center gap-2 text-gray-700'
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
        <div className='w-full sm:flex-1 bg-white rounded-lg p-2 border border-gray-200'>
          <audio
            controls
            src={data.audio}
            className='w-full h-8'
            controlsList='nodownload noplaybackrate'
          />
        </div>
        <span className='text-sm text-gray-600 font-medium px-2'>
          {data.duration ? `${Math.round(data.duration)}s` : ''}
        </span>
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
    <div className='mt-6 space-y-6 text-black'>
      <h3 className='text-lg font-medium text-gray-900'>Your Submissions</h3>
      <div className='space-y-4'>
        {responses.map((response: Response) => (
          <div
            key={response._id}
            className='p-4 bg-gray-50 rounded-lg border border-gray-100'
          >
            <div className='flex justify-between items-start gap-4'>
              <div className='flex-1 min-w-0'>
                {formatResponse(response.content || '', sectionId)}
              </div>
              <time className='text-sm text-gray-500 whitespace-nowrap'>
                {new Date(response.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

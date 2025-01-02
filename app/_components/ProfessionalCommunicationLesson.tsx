import React from 'react';
import LessonCard from './LessonCard';

const ProfessionalCommunicationLesson = () => {
  const vocabularyPhrases = [
    {
      phrase: 'I&apos;d like to propose...',
      usage: 'for suggesting ideas',
    },
    {
      phrase: 'In my experience...',
      usage: 'for sharing expertise',
    },
    {
      phrase: 'Could you clarify...',
      usage: 'for asking questions',
    },
    {
      phrase: 'From my perspective...',
      usage: 'for giving opinions',
    },
  ];

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Today&apos;s English Lesson: Professional Communication 🎯
        </h1>
        <p className='text-gray-800'>
          Designed for Egyptian Arabic speakers learning Business English
        </p>
      </div>

      <div className='space-y-6'>
        <LessonCard title='Watch First' timeNeeded='15 mins' sectionNumber={1}>
          <div className='space-y-4'>
            <div className='text-gray-800'>
              <p className='mb-2'>Watch this TED Talk:</p>
              <a
                href='https://www.youtube.com/watch?v=eIho2S0ZahI'
                target='_blank'
                rel='noopener noreferrer'
                className='block p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors'
              >
                <div className='flex items-center space-x-3'>
                  <svg
                    className='w-6 h-6 text-blue-600'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z' />
                  </svg>
                  <span className='font-medium text-blue-800'>
                    &quot;How to Speak So People Want to Listen&quot;
                  </span>
                </div>
              </a>
            </div>
            <div className='bg-gray-50 p-4 rounded-md'>
              <h4 className='font-semibold mb-2 text-gray-900'>
                Task Requirements:
              </h4>
              <ul className='list-disc list-inside space-y-2 text-gray-800'>
                <li>Take notes on speaker&apos;s techniques</li>
                <li>List new words you hear</li>
              </ul>
            </div>
          </div>
        </LessonCard>

        <LessonCard
          title='New Vocabulary & Phrases'
          timeNeeded='15 mins'
          sectionNumber={2}
        >
          <div className='space-y-4'>
            <p className='font-medium text-gray-900'>
              Practice these professional expressions:
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {vocabularyPhrases.map((item, index) => (
                <div key={index} className='bg-blue-50 p-4 rounded-md'>
                  <p className='font-semibold text-gray-900'>{item.phrase}</p>
                  <p className='text-gray-800'>{item.usage}</p>
                </div>
              ))}
            </div>
            <div className='bg-yellow-50 p-4 rounded-md mt-4'>
              <p className='font-medium text-gray-900'>
                Quick Task: Write one sentence using each phrase
              </p>
            </div>
          </div>
        </LessonCard>

        <LessonCard
          title='Speaking Practice'
          timeNeeded='15 mins'
          sectionNumber={3}
        >
          <div className='space-y-4'>
            <p className='text-gray-800'>
              Record yourself (1-2 minutes) talking about:
            </p>
            <ul className='list-disc list-inside space-y-2 text-gray-800'>
              <li>Your current job</li>
              <li>Your career goals</li>
              <li>A challenge at work</li>
            </ul>
            <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'>
              Start Recording
            </button>
          </div>
        </LessonCard>

        <LessonCard
          title='Email Writing'
          timeNeeded='10 mins'
          sectionNumber={4}
        >
          <div className='space-y-4'>
            <p className='text-gray-800'>
              Fix this email to make it professional:
            </p>
            <div className='bg-gray-100 p-4 rounded-md'>
              <textarea
                className='w-full h-32 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
                placeholder='Enter your professional version here...'
              />
            </div>
          </div>
        </LessonCard>

        <LessonCard title='Homework' timeNeeded='5 mins' sectionNumber={5}>
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-md'>
              <h4 className='font-semibold mb-2 text-gray-900'>Tasks:</h4>
              <ul className='list-decimal list-inside space-y-2 text-gray-800'>
                <li>Read the article about workplace communication</li>
                <li>Write 5 key points you learned</li>
                <li>List 3 questions you have</li>
              </ul>
            </div>
          </div>
        </LessonCard>
      </div>

      <div className='mt-8 p-4 bg-green-50 rounded-md'>
        <p className='text-gray-900 font-medium'>
          Tomorrow&apos;s Topic: Job Interview Practice! 🎯
        </p>
      </div>
    </div>
  );
};

export default ProfessionalCommunicationLesson;

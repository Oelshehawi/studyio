export default function WatchSection() {
  return (
    <div className='space-y-4'>
      <div className='text-gray-800 dark:text-gray-200'>
        <p className='mb-2'>Watch this TED Talk:</p>
        <a
          href='https://www.youtube.com/watch?v=eIho2S0ZahI'
          target='_blank'
          rel='noopener noreferrer'
          className='block p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors'
        >
          <div className='flex items-center space-x-3'>
            <svg
              className='w-6 h-6 text-blue-600 dark:text-blue-400'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z' />
            </svg>
            <span className='font-medium text-blue-800 dark:text-blue-200'>
              &quot;How to Speak So People Want to Listen&quot;
            </span>
          </div>
        </a>
      </div>
      <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md'>
        <h4 className='font-semibold mb-2 text-gray-900 dark:text-white'>
          Task Requirements:
        </h4>
        <ul className='list-disc list-inside space-y-2 text-gray-800 dark:text-gray-200'>
          <li>Take notes on speaker&apos;s techniques</li>
          <li>List new words you hear</li>
        </ul>
      </div>
    </div>
  );
}

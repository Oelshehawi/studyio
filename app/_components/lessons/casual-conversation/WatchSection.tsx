export default function WatchSection() {
  return (
    <div className='space-y-6'>
      <div className='aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden'>
        <iframe
          className='w-full h-full'
          src='https://www.youtube.com/embed/jERzLseoAOM'
          title='Learn English Small Talk and Casual Conversation'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      </div>

      <div className='space-y-4'>
        <h3 className='font-medium text-lg text-gray-900 dark:text-white'>
          Key Points to Remember:
        </h3>
        <ul className='list-disc list-inside space-y-2 text-gray-800 dark:text-gray-200'>
          <li>
            Start with common topics like weather, weekend plans, or hobbies
          </li>
          <li>Use follow-up questions to keep the conversation going</li>
          <li>Share your own experiences to make the conversation two-way</li>
          <li>Pay attention to the other person&apos;s interests</li>
          <li>Use appropriate expressions to show interest and engagement</li>
        </ul>
      </div>

      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
        <h4 className='font-medium text-blue-900 dark:text-blue-100 mb-2'>
          Pro Tips 💡
        </h4>
        <ul className='list-none space-y-2 text-blue-800 dark:text-blue-200'>
          <li>• Remember to smile and maintain eye contact</li>
          <li>• Don&apos;t be afraid to ask for clarification</li>
          <li>• Use gestures to help express yourself</li>
          <li>• Practice active listening</li>
        </ul>
      </div>
    </div>
  );
}

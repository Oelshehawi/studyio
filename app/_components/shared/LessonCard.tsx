interface LessonCardProps {
  title: string;
  timeNeeded: string;
  sectionNumber: number;
  children: React.ReactNode;
}

export default function LessonCard({
  title,
  timeNeeded,
  sectionNumber,
  children,
}: LessonCardProps) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden -mx-2 sm:mx-0'>
      <div className='bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b border-gray-100 dark:border-gray-700'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <span className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-medium px-2.5 py-0.5 rounded-full text-sm'>
              {sectionNumber}
            </span>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
              {title}
            </h2>
          </div>
          <span className='text-sm text-gray-600 dark:text-gray-300'>
            {timeNeeded}
          </span>
        </div>
      </div>
      <div className='p-4 sm:p-6'>{children}</div>
    </div>
  );
}

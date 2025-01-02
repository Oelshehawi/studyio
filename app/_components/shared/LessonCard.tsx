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
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden -mx-2 sm:mx-0'>
      <div className='bg-gray-50 px-4 py-3 border-b border-gray-100'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <span className='bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-sm'>
              {sectionNumber}
            </span>
            <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
          </div>
          <span className='text-sm text-gray-600'>{timeNeeded}</span>
        </div>
      </div>
      <div className='p-4 sm:p-6'>{children}</div>
    </div>
  );
}

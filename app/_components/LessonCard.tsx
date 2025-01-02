
interface LessonCardProps {
  title: string;
  timeNeeded: string;
  children: React.ReactNode;
  sectionNumber: number;
}

const LessonCard: React.FC<LessonCardProps> = ({
  title,
  timeNeeded,
  children,
  sectionNumber,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-4'>
          <span className='bg-blue-100 text-blue-800 font-semibold rounded-full w-8 h-8 flex items-center justify-center'>
            {sectionNumber}
          </span>
          <h3 className='text-xl font-bold text-gray-800'>{title}</h3>
        </div>
        <span className='text-sm text-gray-500'>{timeNeeded}</span>
      </div>
      <div className='prose max-w-none'>{children}</div>
    </div>
  );
};

export default LessonCard;

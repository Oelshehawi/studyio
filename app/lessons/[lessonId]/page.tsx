import DashboardLayout from '@/app/_components/LessonLayout';
import ProfessionalCommunicationLesson from '@/app/_components/lessons/professional-communication';
import CasualConversationLesson from '@/app/_components/lessons/casual-conversation';

type Props = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;

  return (
    <DashboardLayout>
      {lessonId.startsWith('casual-conversation') ? (
        <CasualConversationLesson lessonId={lessonId} />
      ) : lessonId.startsWith('professional-communication') ? (
        <ProfessionalCommunicationLesson lessonId={lessonId} />
      ) : (
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Lesson Not Found
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            The requested lesson could not be found.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}

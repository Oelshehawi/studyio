import DashboardLayout from '@/app/_components/DashboardLayout';
import ProfessionalCommunicationLesson from '@/app/_components/lessons/professional-communication';

type Props = {
  params: Promise<{ lessonId: string }>;
};

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;

  return (
    <DashboardLayout>
      <ProfessionalCommunicationLesson lessonId={lessonId} />
    </DashboardLayout>
  );
}

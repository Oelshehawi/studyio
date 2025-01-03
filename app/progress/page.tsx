import { getUserResponses } from '@/lib/actions';
import DashboardLayout from '@/app/_components/DashboardLayout';

export const dynamic = 'force-dynamic';

const SECTIONS = [
  { id: 'vocabulary', title: 'Vocabulary & Phrases' },
  { id: 'speaking', title: 'Speaking Practice' },
  { id: 'email-writing', title: 'Email Writing' },
  { id: 'homework', title: 'Homework' },
];

const MODULES = [
  {
    id: 'professional-communication-1',
    title: 'Professional Communication',
    sections: SECTIONS,
  },
  {
    id: 'business-writing-1',
    title: 'Business Writing',
    sections: ['Coming Soon'],
    isLocked: true,
  },
  {
    id: 'job-interviews-1',
    title: 'Job Interviews',
    sections: ['Coming Soon'],
    isLocked: true,
  },
];

export default async function ProgressPage() {
  const lessonId = 'professional-communication-1';
  // Get submissions for each section
  const submissions = await Promise.all(
    SECTIONS.map(async (section) => {
      const responses = await getUserResponses(lessonId, section.id);
      return {
        sectionId: section.id,
        hasSubmission: responses && responses.length > 0,
      };
    })
  );

  // Calculate progress percentage
  const completedSections = submissions.filter((s) => s.hasSubmission).length;
  const progressPercentage = Math.round(
    (completedSections / SECTIONS.length) * 100
  );

  return (
    <DashboardLayout>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Progress</h1>
          <p className='text-gray-600'>
            Track your learning journey and achievements
          </p>
        </div>

        <div className='space-y-8'>
          {MODULES.map((module) => (
            <div
              key={module.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
                module.isLocked ? 'opacity-75' : ''
              }`}
            >
              <div className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    {module.title}
                  </h2>
                  {module.id === lessonId && progressPercentage === 100 && (
                    <span className='bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
                      Completed
                    </span>
                  )}
                </div>

                <div className='space-y-4'>
                  {!module.isLocked ? (
                    <>
                      <div className='w-full bg-gray-100 rounded-full h-2.5'>
                        <div
                          className='bg-blue-600 h-2.5 rounded-full transition-all duration-500'
                          style={{
                            width: `${progressPercentage}%`,
                          }}
                        ></div>
                      </div>
                      <div className='grid gap-4 sm:grid-cols-2'>
                        {SECTIONS.map((section) => {
                          const submission = submissions.find(
                            (s) => s.sectionId === section.id
                          );
                          return (
                            <div
                              key={section.id}
                              className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  submission?.hasSubmission
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}
                              />
                              <span className='text-gray-700'>
                                {section.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className='text-center py-8'>
                      <span className='px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium'>
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8 bg-blue-50 rounded-xl p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Learning Streak 🔥
          </h3>
          <p className='text-gray-700'>
            Start your learning journey today! Complete lessons to build your
            streak.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

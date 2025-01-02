import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { getUserResponses } from '@/lib/actions';

const COURSE_MODULES = [
  {
    id: 'professional-communication-1',
    title: 'Professional Communication',
    description:
      'Learn essential phrases and techniques for effective workplace communication.',
    icon: '💼',
    isActive: true,
    skills: [
      'Email Writing',
      'Meeting Vocabulary',
      'Professional Phrases',
      'Business Small Talk',
    ],
  },
  {
    id: 'business-writing-1',
    title: 'Business Writing',
    description: 'Master the art of professional business writing.',
    icon: '✍️',
    isActive: false,
    skills: [
      'Report Writing',
      'Proposal Creation',
      'Email Etiquette',
      'Document Formatting',
    ],
  },
  {
    id: 'job-interviews-1',
    title: 'Job Interviews',
    description: 'Prepare for job interviews with confidence.',
    icon: '🎯',
    isActive: false,
    skills: [
      'Common Questions',
      'Professional Responses',
      'Body Language',
      'Follow-up Emails',
    ],
  },
  {
    id: 'daily-conversations-1',
    title: 'Daily Conversations',
    description: 'Practice everyday English conversations.',
    icon: '💬',
    isActive: false,
    skills: ['Small Talk', 'Phone Calls', 'Social Events', 'Shopping & Dining'],
  },
];

export default async function HomePage() {
  const user = await currentUser();

  const lessonId = 'professional-communication-1';
  const sections = ['vocabulary', 'speaking', 'email-writing', 'homework'];

  // Get submissions for each section
  const submissions = await Promise.all(
    sections.map(async (sectionId) => {
      const responses = await getUserResponses(lessonId, sectionId);
      return {
        sectionId,
        hasSubmission: responses && responses.length > 0,
      };
    })
  );

  // Calculate progress percentage
  const completedSections = submissions.filter((s) => s.hasSubmission).length;
  const progressPercentage = Math.round(
    (completedSections / sections.length) * 100
  );

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      {/* Hero Section */}
      <div className='max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <div className='text-center mb-16 relative'>
          {/* Background Pattern */}
          <div className='absolute inset-0 -z-10'>
            <div className='absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]' />
          </div>

          <div className='relative'>
            {/* User Welcome */}
            <div className='mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-600 shadow-sm'>
              <span>Welcome back,</span>
              <span className='font-medium text-blue-600'>
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </span>
              {progressPercentage === 100 && (
                <span className='ml-2 flex h-2 w-2'>
                  <span className='animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75'></span>
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
                </span>
              )}
            </div>

            <h1 className='text-4xl font-bold text-gray-900 mb-4 sm:text-5xl'>
              Welcome to StudyIO! 👋
            </h1>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Your journey to professional English mastery starts here. Learn at
              your own pace with our interactive lessons designed specifically
              for Egyptian Arabic speakers.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto mb-16'>
          <div className='bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100'>
            <div className='text-3xl font-bold text-blue-600 mb-1'>
              {progressPercentage}%
            </div>
            <div className='text-sm text-gray-600'>Course Progress</div>
          </div>
          <div className='bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100'>
            <div className='text-3xl font-bold text-blue-600 mb-1'>
              {completedSections}
            </div>
            <div className='text-sm text-gray-600'>Completed Sections</div>
          </div>
          <div className='bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100'>
            <div className='text-3xl font-bold text-blue-600 mb-1'>1</div>
            <div className='text-sm text-gray-600'>Available Lessons</div>
          </div>
        </div>

        {/* Course Grid */}
        <div className='grid gap-8 md:grid-cols-2'>
          {COURSE_MODULES.map((module) =>
            module.isActive ? (
              <Link
                key={module.id}
                href={`/lessons/${module.id}`}
                className='group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200'
              >
                <div className='p-8'>
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <span className='text-4xl mb-4 block'>{module.icon}</span>
                      <h2 className='text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>
                        {module.title}
                      </h2>
                    </div>
                    {progressPercentage === 100 && (
                      <span className='bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
                        Completed
                      </span>
                    )}
                  </div>
                  <p className='text-gray-600 mb-6'>{module.description}</p>
                  <div className='space-y-3'>
                    <h3 className='text-sm font-medium text-gray-900'>
                      What you&apos;ll learn:
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {module.skills.map((skill) => (
                        <span
                          key={skill}
                          className='px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={module.id}
                className='relative overflow-hidden bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-100'
              >
                <div className='p-8 opacity-75'>
                  <span className='text-4xl mb-4 block filter grayscale'>
                    {module.icon}
                  </span>
                  <h2 className='text-2xl font-bold text-gray-600 mb-2'>
                    {module.title}
                  </h2>
                  <p className='text-gray-500 mb-6'>{module.description}</p>
                  <div className='space-y-3'>
                    <h3 className='text-sm font-medium text-gray-600'>
                      What you&apos;ll learn:
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {module.skills.map((skill) => (
                        <span
                          key={skill}
                          className='px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className='absolute inset-0 bg-gray-50/50 backdrop-blur-sm flex items-center justify-center'>
                    <span className='px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium'>
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

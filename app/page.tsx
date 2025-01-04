import Link from 'next/link';
import DashboardLayout from './_components/LessonLayout';

const COURSE_MODULES = [
  {
    id: 'casual-conversation-1',
    title: 'Casual Conversations',
    description:
      'Master everyday English conversations with confidence and fun.',
    icon: '💬',
    isActive: true,
    skills: [
      'Small Talk',
      'Expressing Opinions',
      'Storytelling',
      'Cultural Exchange',
    ],
  },
  {
    id: 'professional-communication-1',
    title: 'Professional Communication',
    description: 'Learn to communicate effectively in professional settings.',
    icon: '💼',
    isActive: true,
    skills: [
      'Email Writing',
      'Meeting Participation',
      'Presentations',
      'Business Etiquette',
    ],
  },
  {
    id: 'workplace-culture-1',
    title: 'Canadian Workplace Culture',
    description:
      'Coming Soon - Understand and adapt to Canadian work environment.',
    icon: '🍁',
    isActive: false,
    skills: [
      'Workplace Etiquette',
      'Team Collaboration',
      'Work-Life Balance',
      'Office Communication',
    ],
  },
  {
    id: 'daily-life-1',
    title: 'Daily Life in Canada',
    description:
      'Coming Soon - Essential English for living and working in Canada.',
    icon: '🏙️',
    isActive: false,
    skills: [
      'Healthcare & Services',
      'Banking & Finance',
      'Housing & Utilities',
      'Transportation',
    ],
  },
];

export default function Home() {
  return (
    <DashboardLayout>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Welcome to StudyIO 👋
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Your personalized English learning journey starts here
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {COURSE_MODULES.map((module) => (
            <div
              key={module.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${
                !module.isActive ? 'opacity-75' : ''
              }`}
            >
              <div className='p-6'>
                <div className='flex items-start gap-4'>
                  <span className='text-3xl'>{module.icon}</span>
                  <div>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                      {module.title}
                    </h2>
                    <p className='text-gray-600 dark:text-gray-300 mt-1'>
                      {module.description}
                    </p>
                  </div>
                </div>

                {module.isActive && module.skills.length > 0 && (
                  <>
                    <div className='mt-4 flex flex-wrap gap-2'>
                      {module.skills.map((skill) => (
                        <span
                          key={skill}
                          className='px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/lessons/${module.id}`}
                      className='mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                    >
                      Start Learning
                      <svg
                        className='ml-2 w-4 h-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </Link>
                  </>
                )}

                {!module.isActive && (
                  <div className='mt-4 inline-flex items-center text-gray-500 dark:text-gray-400'>
                    <svg
                      className='mr-2 w-4 h-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            Quick Tip 💡
          </h3>
          <p className='text-gray-700 dark:text-gray-300'>
            Start with the Casual Conversations lesson to build confidence in
            everyday English interactions. Then move on to Professional
            Communication to enhance your workplace language skills.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

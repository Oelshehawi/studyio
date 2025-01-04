import Link from 'next/link';
import DashboardLayout from './_components/LessonLayout';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  skills: string[];
  isActive: boolean;
}

const COURSE_MODULES: CourseModule[] = [
  {
    id: 'casual-conversation-1',
    title: 'Casual Conversation',
    description: 'Learn to engage in everyday conversations with confidence',
    icon: '💬',
    skills: ['Speaking', 'Listening', 'Cultural Understanding'],
    isActive: true,
  },
  {
    id: 'professional-communication-1',
    title: 'Professional Communication',
    description: 'Learn to communicate effectively in professional settings',
    icon: '💼',
    skills: ['Email Writing', 'Meeting Participation', 'Business Etiquette'],
    isActive: true,
  },
  {
    id: 'tax-essentials-1',
    title: 'Tax Talk: BC Edition',
    description: 'Master Canadian tax concepts while improving your English',
    icon: '📊',
    skills: ['Tax Vocabulary', 'Document Reading', 'Financial Literacy'],
    isActive: true,
  },
  {
    id: 'daily-life-1',
    title: 'Daily Life in Canada',
    description: 'Essential English for living and working in Canada',
    icon: '🏙️',
    skills: ['Practical Vocabulary', 'Local Knowledge', 'Cultural Integration'],
    isActive: false,
  },
  {
    id: 'workplace-culture-1',
    title: 'Canadian Workplace Culture',
    description: 'Understand and adapt to Canadian work environments',
    icon: '🍁',
    skills: [
      'Professional Communication',
      'Cultural Norms',
      'Workplace Etiquette',
    ],
    isActive: false,
  },
];

export default function Home() {
  return (
    <DashboardLayout>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
          Welcome to StudyIO
        </h1>
        <div className='grid gap-6 sm:grid-cols-2'>
          {COURSE_MODULES.map((module) => (
            <Link
              key={module.id}
              href={module.isActive ? `/lessons/${module.id}` : '#'}
              className={`block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors ${
                !module.isActive && 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-2xl'>
                  {module.icon}
                </div>
                <div className='flex-1'>
                  <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                    {module.title}
                  </h2>
                  <p className='text-gray-600 dark:text-gray-300 mb-4'>
                    {module.description}
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {module.skills.map((skill) => (
                      <span
                        key={skill}
                        className='px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {!module.isActive && (
                    <div className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

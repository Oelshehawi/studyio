import { getUserResponses } from '@/lib/actions';
import DashboardLayout from '@/app/_components/LessonLayout';

export const dynamic = 'force-dynamic';

interface Section {
  id: string;
  title: string;
}

type ModuleSection = Section | string;

interface Module {
  id: string;
  title: string;
  sections: ModuleSection[];
  isLocked?: boolean;
}

const PROFESSIONAL_SECTIONS: Section[] = [
  { id: 'vocabulary', title: 'Vocabulary & Phrases' },
  { id: 'speaking', title: 'Speaking Practice' },
  { id: 'email-writing', title: 'Email Writing' },
  { id: 'homework', title: 'Homework' },
];

const CASUAL_SECTIONS: Section[] = [
  { id: 'watch', title: 'Watch & Learn' },
  { id: 'conversation', title: 'Conversation Practice' },
  { id: 'storytelling', title: 'Tell Your Story' },
  { id: 'opinion', title: 'Express Your Opinion' },
  { id: 'speaking', title: 'Speaking Practice' },
];

const TAX_SECTIONS: Section[] = [
  { id: 'tax-basics', title: 'Tax Basics & Vocabulary' },
  { id: 'income-tax', title: 'Income Tax Essentials' },
  { id: 'deductions', title: 'Credits & Deductions' },
  { id: 'filing', title: 'Filing Process' },
  { id: 'scenarios', title: 'Real-life Scenarios' },
];

const WORKPLACE_SECTIONS: Section[] = [
  { id: 'etiquette', title: 'Workplace Etiquette' },
  { id: 'collaboration', title: 'Team Collaboration' },
  { id: 'work-life', title: 'Work-Life Balance' },
  { id: 'office-comm', title: 'Office Communication' },
];

const DAILY_LIFE_SECTIONS: Section[] = [
  { id: 'healthcare', title: 'Healthcare & Services' },
  { id: 'banking', title: 'Banking & Finance' },
  { id: 'housing', title: 'Housing & Utilities' },
  { id: 'transportation', title: 'Transportation' },
];

const MODULES: Module[] = [
  {
    id: 'casual-conversation-1',
    title: 'Casual Conversations',
    sections: CASUAL_SECTIONS,
  },
  {
    id: 'professional-communication-1',
    title: 'Professional Communication',
    sections: PROFESSIONAL_SECTIONS,
  },
  {
    id: 'tax-essentials-1',
    title: 'Tax Talk: BC Edition',
    sections: TAX_SECTIONS,
  },
  {
    id: 'workplace-culture-1',
    title: 'Canadian Workplace Culture',
    sections: WORKPLACE_SECTIONS,
    isLocked: true,
  },
  {
    id: 'daily-life-1',
    title: 'Daily Life in Canada',
    sections: DAILY_LIFE_SECTIONS,
    isLocked: true,
  },
];

// Helper function to check if a section is a valid Section object
function isSection(section: ModuleSection): section is Section {
  return typeof section === 'object' && section !== null && 'id' in section;
}

export default async function ProgressPage() {
  // Get submissions for both active lessons
  const activeModules = MODULES.filter((module) => !module.isLocked);
  const allSubmissions = await Promise.all(
    activeModules.map(async (module) => {
      const submissions = await Promise.all(
        module.sections.filter(isSection).map(async (section) => {
          const responses = await getUserResponses(module.id, section.id);
          return {
            moduleId: module.id,
            sectionId: section.id,
            hasSubmission: responses && responses.length > 0,
          };
        })
      );
      return {
        moduleId: module.id,
        submissions,
      };
    })
  );

  // Calculate progress percentages for each module
  const moduleProgress = allSubmissions.map(({ moduleId, submissions }) => {
    const moduler = MODULES.find((m) => m.id === moduleId);
    if (!moduler || moduler.isLocked)
      return { moduleId, progressPercentage: 0, submissions };

    // Count how many sections have at least one response
    const sectionsWithResponses = submissions.reduce((count, submission) => {
      return submission.hasSubmission ? count + 1 : count;
    }, 0);

    // Calculate percentage based on sections with responses
    return {
      moduleId,
      progressPercentage: Math.round(
        (sectionsWithResponses / submissions.length) * 100
      ),
      submissions,
    };
  });

  return (
    <DashboardLayout>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            My Progress
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Track your learning journey and achievements
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
            Progress is calculated based on completed sections
          </p>
        </div>

        <div className='space-y-8'>
          {MODULES.map((module) => {
            const progress = moduleProgress.find(
              (p) => p.moduleId === module.id
            );

            return (
              <div
                key={module.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${
                  module.isLocked ? 'opacity-75' : ''
                }`}
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                      {module.title}
                    </h2>
                    {!module.isLocked && (
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          {progress?.progressPercentage || 0}% Complete
                        </span>
                        {progress?.progressPercentage === 100 && (
                          <span className='bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-sm font-medium'>
                            All Sections Complete
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className='space-y-4'>
                    {!module.isLocked ? (
                      <>
                        <div className='w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5'>
                          <div
                            className='bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-500'
                            style={{
                              width: `${progress?.progressPercentage || 0}%`,
                            }}
                          ></div>
                        </div>
                        <div className='grid gap-4 sm:grid-cols-2'>
                          {module.sections.map((section) => {
                            if (typeof section === 'string') return null;
                            const submission = progress?.submissions.find(
                              (s) => s.sectionId === section.id
                            );
                            return (
                              <div
                                key={section.id}
                                className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    submission?.hasSubmission
                                      ? 'bg-green-500'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                />
                                <span className='text-gray-700 dark:text-gray-200'>
                                  {section.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className='text-center py-8'>
                        <span className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium'>
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className='mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            Learning Streak 🔥
          </h3>
          <p className='text-gray-700 dark:text-gray-300'>
            Start your learning journey today! Complete lessons to build your
            streak.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

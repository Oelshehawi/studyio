import DashboardLayout from '@/app/_components/DashboardLayout';
import Translator from '@/app/_components/resources/Translator';

export default async function ResourcesPage() {
  return (
    <DashboardLayout>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Resources
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Helpful tools to support your learning journey
          </p>
        </div>

        <div className='grid gap-6'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
            <div className='p-6'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                English-Arabic Translator
              </h2>
              <Translator />
            </div>
          </div>

          <div className='bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              Coming Soon 🚀
            </h3>
            <ul className='list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300'>
              <li>Pronunciation Guide</li>
              <li>Grammar Checker</li>
              <li>Vocabulary Flashcards</li>
              <li>Practice Exercises</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

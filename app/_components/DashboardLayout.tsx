'use client';
import { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation Header */}
      <nav className='bg-white shadow-sm fixed w-full z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className='md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900'
            >
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
            <div className='flex-1 flex justify-center items-center'>
              <span className='text-xl font-bold text-blue-600'>StudyIO</span>
            </div>
            <div className='flex items-center gap-4'>
              <div className='hidden sm:block'>
                <span className='text-sm text-gray-600'>
                  {user?.emailAddresses[0]?.emailAddress}
                </span>
              </div>
              <UserButton afterSignOutUrl='/sign-in' />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar and Main Content */}
      <div className='flex pt-16'>
        {/* Sidebar */}
        <div
          className={`
          md:w-64 bg-white shadow-sm fixed h-full z-30
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        >
          <div className='p-4'>
            <h2 className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>
              Course Modules
            </h2>
            <div className='mt-4 space-y-2'>
              <a
                href='#'
                className='block px-4 py-2 text-sm text-gray-900 bg-blue-50 rounded-md font-medium'
              >
                Professional Communication
              </a>
              <span className='block px-4 py-2 text-sm text-gray-400 rounded-md cursor-not-allowed bg-gray-50'>
                Business Writing
              </span>
              <span className='block px-4 py-2 text-sm text-gray-400 rounded-md cursor-not-allowed bg-gray-50'>
                Job Interviews
              </span>
              <span className='block px-4 py-2 text-sm text-gray-400 rounded-md cursor-not-allowed bg-gray-50'>
                Daily Conversations
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 md:ml-64'>
          <main className='py-6 px-4 sm:px-6 lg:px-8'>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

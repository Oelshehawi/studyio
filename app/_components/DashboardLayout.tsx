'use client';
import { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAVIGATION_ITEMS = [
  {
    title: 'Home',
    href: '/',
    icon: (
      <svg
        className='w-5 h-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
        />
      </svg>
    ),
  },
  {
    title: 'Current Lesson',
    href: '/lessons/professional-communication-1',
    icon: (
      <svg
        className='w-5 h-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        />
      </svg>
    ),
  },
  {
    title: 'My Progress',
    href: '/progress',
    icon: (
      <svg
        className='w-5 h-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
        />
      </svg>
    ),
  },
  {
    title: 'Resources',
    href: '/resources',
    icon: (
      <svg
        className='w-5 h-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        />
      </svg>
    ),
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation Header */}
      <div className='fixed w-full z-10 top-0'>
        <div className='py-6 px-4 sm:px-6 lg:px-8'>
          <div className='lg:ml-64'>
            <div className='max-w-4xl mx-auto px-2 sm:px-6'>
              <div className='bg-white/80 backdrop-blur-sm shadow-sm rounded-xl'>
                <div className='flex justify-between h-16 px-4'>
                  <div className='flex items-center'>
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className='lg:hidden p-2 -ml-2 rounded-md text-gray-600 hover:text-gray-900'
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
                    <Link
                      href='/'
                      className='text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors ml-2 lg:ml-0'
                    >
                      StudyIO
                    </Link>
                  </div>
                  <div className='flex items-center gap-6'>
                    <div className='hidden sm:block'>
                      <span className='text-sm text-gray-600'>
                        {user?.emailAddresses[0]?.emailAddress}
                      </span>
                    </div>
                    <UserButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar and Main Content */}
      <div className='lg:flex pt-28'>
        {/* Sidebar */}
        <div
          className={`
          fixed z-30 bg-white shadow-sm
          lg:inset-y-0 lg:left-0 lg:w-64 lg:translate-y-0 lg:h-full
          w-full h-[30%] bottom-0 rounded-t-3xl lg:rounded-none
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        >
          <div className=' overflow-y-auto'>
            {/* Mobile Handle */}
            <div className='lg:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-4' />
            <div className='space-y-1 p-4'>
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors
                    ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }
                  `}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 lg:ml-64'>
          <main className='py-6 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-4xl mx-auto px-2 sm:px-6'>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

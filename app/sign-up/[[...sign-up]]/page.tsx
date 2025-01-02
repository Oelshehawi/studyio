'use client'
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-blue-600 sm:text-4xl'>
            StudyIO
          </h1>
          <p className='mt-2 text-base text-gray-600 sm:text-lg'>
            Create your account to get started
          </p>
        </div>
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <SignUp
            appearance={{
              elements: {
                rootBox: 'mx-auto w-full',
                card: 'bg-white shadow-md rounded-lg p-6 sm:p-8',
                headerTitle: 'text-xl sm:text-2xl font-bold text-gray-900',
                headerSubtitle: 'text-sm sm:text-base text-gray-600',
                formButtonPrimary:
                  'w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors',
                footerActionLink:
                  'text-blue-600 hover:text-blue-800 text-sm sm:text-base',
                socialButtonsBlockButton:
                  'w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors',
                socialButtonsBlockButtonText:
                  'text-gray-600 text-sm sm:text-base',
                dividerLine: 'bg-gray-200',
                dividerText: 'text-gray-500 text-sm',
                formFieldInput: 'w-full text-sm sm:text-base',
                formFieldLabel: 'text-sm sm:text-base',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

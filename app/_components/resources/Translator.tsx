'use client';

import { useState } from 'react';
import { translate } from '@/lib/actions';

export default function Translator() {
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ar');
  const [translation, setTranslation] = useState('');
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleTranslate() {
    if (!sourceText.trim()) return;

    setIsLoading(true);
    setError('');
    setAlternatives([]);
    try {
      const result = await translate({
        text: sourceText,
        sourceLang,
        targetLang,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setTranslation(result?.translation as string);
        if (result.alternatives?.length) {
          setAlternatives(result.alternatives);
        }
      }
    } catch {
      setError('Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleSwapLanguages() {
    setSourceLang((prev) => (prev === 'en' ? 'ar' : 'en'));
    setTargetLang((prev) => (prev === 'en' ? 'ar' : 'en'));
    setSourceText(translation);
    setTranslation(sourceText);
    setAlternatives([]);
    setError('');
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-4 mb-6'>
        <div className='flex-1'>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className='w-full p-2 border rounded-md text-gray-900 bg-white'
          >
            <option value='en'>English</option>
            <option value='ar'>Arabic</option>
          </select>
        </div>
        <button
          onClick={handleSwapLanguages}
          className='p-2 text-gray-600 hover:text-gray-900'
        >
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
              d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
            />
          </svg>
        </button>
        <div className='flex-1'>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className='w-full p-2 border rounded-md text-gray-900 bg-white'
          >
            <option value='ar'>Arabic</option>
            <option value='en'>English</option>
          </select>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder='Enter text to translate...'
            className='w-full h-40 p-3 border rounded-lg text-gray-900 placeholder-gray-400'
            dir={sourceLang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
        <div className='space-y-4'>
          <div
            className={`w-full h-40 p-3 border rounded-lg bg-gray-50 text-gray-900 ${
              isLoading ? 'animate-pulse' : ''
            }`}
            dir={targetLang === 'ar' ? 'rtl' : 'ltr'}
          >
            {error ? (
              <span className='text-red-600'>{error}</span>
            ) : translation ? (
              translation
            ) : (
              <span className='text-gray-400'>
                Translation will appear here...
              </span>
            )}
          </div>
          {alternatives.length > 0 && (
            <div className='space-y-2'>
              <p className='text-sm text-gray-600 font-medium'>
                Alternative translations:
              </p>
              <div className='space-y-1'>
                {alternatives.map((alt, index) => (
                  <div
                    key={index}
                    className='p-2 bg-white border rounded-md text-gray-800 cursor-pointer hover:bg-gray-50'
                    onClick={() => setTranslation(alt)}
                    dir={targetLang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {alt}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex justify-end'>
        <button
          onClick={handleTranslate}
          disabled={isLoading || !sourceText.trim()}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
        >
          {isLoading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  );
}

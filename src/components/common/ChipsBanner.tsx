'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ChipsBannerProps {
  text?: string;
  buttonText?: string;
  buttonHref?: string;
}

const ChipsBanner = ({
  text = 'Unlock more free Chips',
  buttonText = 'Get Premium',
  buttonHref = '/', // '/premium',
}: ChipsBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Don't show on homepage
  if (pathname === '/') {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 w-full py-1.5 px-4 bg-cover bg-center shadow-md min-h-[40px]"
      data-banner="chips"
      style={{ backgroundImage: 'url("/assets/general_ad_banner.png")' }}
    >
      {/* Content */}
      <div className="relative z-10 w-full mx-auto flex items-center justify-center pr-8">
        {/* Center container for text and button */}
        <div className="flex flex-row items-center justify-center gap-3 md:gap-8">
          <h2 className="text-sm md:text-xl font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-none">
            {text}
          </h2>
          <Link
            href={buttonHref}
            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:opacity-90 transition-opacity text-white px-3 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-md font-medium whitespace-nowrap"
          >
            {buttonText}
          </Link>
        </div>

        {/* Close button at extreme right */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-0 text-gray-700 hover:text-gray-900 p-1"
          aria-label="Close banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChipsBanner;

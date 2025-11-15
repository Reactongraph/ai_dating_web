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
      className="fixed top-0 left-0 right-0 z-50 w-auto py-1 px-2 bg-cover bg-center shadow-md"
      data-banner="chips"
      style={{ backgroundImage: 'url("/assets/general_ad_banner.png")' }}
    >
      {/* Content */}
      <div className="relative z-10 w-full mx-auto flex items-center ">
        {/* Center container for text and button */}
        <div className="flex-1 flex items-center justify-center space-x-8">
          <h2 className="text-xl font-semibold text-gray-800">{text}</h2>
          <Link
            href={buttonHref}
            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:opacity-90 transition-opacity text-white px-4 py-1 rounded-full text-md font-medium"
          >
            {buttonText}
          </Link>
        </div>

        {/* Close button at extreme right */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 text-gray-700 hover:text-gray-900"
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

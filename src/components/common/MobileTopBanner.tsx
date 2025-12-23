'use client';

import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaGift } from 'react-icons/fa';
import Link from 'next/link';

interface MobileTopBannerProps {
  text?: string;
  buttonText?: string;
  buttonHref?: string;
}

const MobileTopBanner = ({
  text = 'Unlock more free chips',
  buttonText = 'Claim now',
  buttonHref = '/',
}: MobileTopBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-[#FF00CC] via-[#FF3366] to-[#FF9966] h-[44px] md:h-[52px] px-4 flex items-center justify-between z-50 transition-all duration-300 shadow-lg"
      data-banner="mobile-top"
    >
      <div className="flex-grow text-center flex items-center justify-center gap-2 md:gap-4">
        <span className="text-white font-bold text-lg xs:text-sm md:text-xl truncate max-w-[200px] sm:max-w-none">
          {text}
        </span>
        <Link
          href={buttonHref}
          className="bg-[#1A1A1A] text-white px-3 py-1 md:px-5 md:py-1.5 rounded-full flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm font-bold hover:bg-black/80 transition-colors shrink-0"
        >
          <FaGift className="text-white text-[10px] md:text-sm" />
          <span>{buttonText}</span>
        </Link>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="ml-2 md:ml-4 text-white/80 hover:text-white transition-colors shrink-0"
        aria-label="Close banner"
      >
        <IoMdClose className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

export default MobileTopBanner;

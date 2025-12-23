'use client';

import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaGift } from 'react-icons/fa';

const MobileTopBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-[#FF00CC] via-[#FF3366] to-[#FF9966] py-3 px-4 flex items-center justify-between z-50 md:hidden">
      <div className="flex-grow text-center">
        <span className="text-white font-bold text-lg">Unlock more free chips</span>
      </div>
      
      <button className="bg-[#1A1A1A] text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold ml-2">
        <FaGift className="text-white" />
        Claim now
      </button>

      <button 
        onClick={() => setIsVisible(false)}
        className="ml-3 text-white/80 hover:text-white"
      >
        <IoMdClose size={24} />
      </button>
    </div>
  );
};

export default MobileTopBanner;


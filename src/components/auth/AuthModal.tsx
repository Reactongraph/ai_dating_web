import { ReactNode } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthModal = ({ isOpen, onClose, children, title, subtitle }: AuthModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 sm:p-4 md:p-6">
      {/* Backdrop for closing */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative flex flex-col md:flex-row w-full max-w-[900px] h-full sm:h-auto sm:max-h-[90vh] bg-gray-1a sm:rounded-2xl overflow-hidden z-10 shadow-2xl">
        {/* Left Side - Image */}
        <div
          className="relative md:w-1/2 w-full h-[200px] sm:h-[300px] md:h-auto overflow-hidden shrink-0 md:min-h-[600px]"
          style={{
            backgroundImage: 'url("/assets/auth_bg_image.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Fixed height container for the left side */}
          <div className="absolute inset-0">
            <Image
              src="/assets/login_screen_girlboy.png"
              alt="Daily Love"
              fill
              className="md:!h-[423px] !h-full !bottom-[0px] w-auto !object-cover !inset-auto"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-7 bg-black/20">
              <div className="flex items-center justify-start">
                <Image
                  src="/assets/daily_love.png"
                  alt="Daily Love"
                  width={150}
                  height={40}
                  className="object-contain md:w-[180px] md:h-[50px]"
                />
              </div>
              <div className="flex flex-col gap-2 md:gap-4">
                <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md rounded-lg px-3 py-1.5 md:px-4 md:py-2 w-fit">
                  <Image src="/assets/chat.svg" alt="Chat" width={18} height={18} className="md:w-[20px] md:h-[20px]" />
                  <span className="text-[10px] md:text-sm text-white font-medium">Limitless Chat, Infinite Possibilities</span>
                </div>
                <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md rounded-lg px-3 py-1.5 md:px-4 md:py-2 w-fit">
                  <Image src="/assets/wand.svg" alt="Unique" width={18} height={18} className="md:w-[20px] md:h-[20px]" />
                  <span className="text-[10px] md:text-sm text-white font-medium">AI-Created Images as Unique as You Are</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div
          className="relative md:w-1/2 w-full p-6 sm:p-8 bg-gray-1a overflow-y-auto custom-scrollbar flex-1 md:flex-none"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-20"
          >
            <IoClose size={24} />
          </button>

          <div className="mb-6 md:mb-8 mt-4 md:mt-0">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h2>
            {subtitle && <p className="text-gray-400 text-xs md:text-sm">{subtitle}</p>}
          </div>

          <div className="pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

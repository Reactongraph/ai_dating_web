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

const AuthModal = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
}: AuthModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex w-full max-w-[900px] bg-[#1A1A1A] rounded-2xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="relative w-1/2 bg-gradient-to-br from-purple-600 to-pink-500">
          <Image
            src="/assets/auth-banner.png"
            alt="True Companion"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-8 left-8 space-y-4">
            <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 w-fit">
              <Image
                src="/assets/chat-icon.svg"
                alt="Chat"
                width={20}
                height={20}
              />
              <span className="text-sm text-white">
                Limitless Chat, Infinite Possibilities
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 w-fit">
              <Image
                src="/assets/unique-icon.svg"
                alt="Unique"
                width={20}
                height={20}
              />
              <span className="text-sm text-white">
                AI-Created Images as Unique as You Are
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="relative w-1/2 p-8 bg-[#1A1A1A]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

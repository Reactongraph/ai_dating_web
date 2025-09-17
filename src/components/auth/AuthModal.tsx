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
      <div className="flex flex-col md:flex-row w-full max-w-[900px] bg-gray-1a rounded-2xl overflow-hidden">
        {/* Left Side - Image */}
        <div
          className="relative md:w-1/2 w-full min-h-[400px] md:min-h-[600px] max-h-[700px] overflow-hidden"
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
              alt="True Companion"
              fill
              className="object-cover object-center "
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-between p-7">
              <div className="flex items-center justify-start pl-4">
                <Image
                  src="/assets/true_compnion_logo.png"
                  alt="True Companion"
                  width={180}
                  height={50}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 w-fit">
                  <Image
                    src="/assets/chat.svg"
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
                    src="/assets/wand.svg"
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
          </div>
        </div>

        {/* Right Side - Content */}
        <div
          className="relative md:w-1/2 w-full p-8 bg-gray-1a overflow-y-auto"
          style={{ maxHeight: '700px' }}
        >
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

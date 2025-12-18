import { IoClose } from 'react-icons/io5';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AgeVerificationModal = ({ isOpen, onClose, onConfirm }: AgeVerificationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-red-500/30">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 opacity-20 blur-xl"></div>

        {/* Content container */}
        <div className="relative bg-gray-900/95 m-[1px] rounded-2xl p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative"
              >
                <defs>
                  <linearGradient id="ageVerifyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
                {/* Outer circle with gradient */}
                <circle cx="40" cy="40" r="38" fill="url(#ageVerifyGradient)" opacity="0.9" />
                {/* Inner circle for depth */}
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.3"
                />
                {/* Warning triangle */}
                <path d="M40 25 L50 45 L30 45 Z" fill="white" opacity="0.9" />
                <circle cx="40" cy="40" r="2" fill="white" />
                <rect x="38.5" y="32" width="3" height="6" rx="1.5" fill="white" />
                {/* 18+ text */}
                <text
                  x="40"
                  y="58"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="Arial, sans-serif"
                >
                  18+
                </text>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            Age Verification Required
          </h2>

          {/* Subtitle */}
          <p className="text-gray-400 text-center mb-6">
            You are about to access adult content (18+)
          </p>

          {/* Warning message */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300 text-center leading-relaxed">
              By clicking{' '}
              <span className="text-red-400 font-semibold">&quot;I&apos;m 18+&quot;</span>, you
              confirm that you are at least 18 years old and agree to view adult content.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={onConfirm}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-red-500/30"
            >
              I&apos;m 18+ Years Old
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-800 text-gray-300 font-medium py-3.5 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Cancel
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-500 text-center mt-6">
            This content is intended for adults only. Please ensure you comply with local laws and
            regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;

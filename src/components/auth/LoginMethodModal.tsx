import AuthModal from './AuthModal';
import { FiMail } from 'react-icons/fi';
// import { BsPhone } from 'react-icons/bs'; // Temporarily disabled

interface LoginMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailLogin: () => void;
  // onPhoneLogin: () => void; // Temporarily disabled
}

const LoginMethodModal = ({
  isOpen,
  onClose,
  onEmailLogin,
  // onPhoneLogin, // Temporarily disabled
}: LoginMethodModalProps) => {
  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Login Method"
      subtitle="Select how you'd like to log in to your account"
    >
      <div className="space-y-4">
        <button
          onClick={onEmailLogin}
          className="w-full flex items-center justify-between px-6 py-4 bg-gray-2a rounded-lg hover:bg-gray-333 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <FiMail className="w-6 h-6 text-accent-cyan" />
            <div className="text-left">
              <h3 className="text-white font-medium">Email Login</h3>
              <p className="text-sm text-gray-400">
                Login with email and password
              </p>
            </div>
          </div>
        </button>

        {/* Phone Login temporarily disabled
        <button
          onClick={onPhoneLogin}
          className="w-full flex items-center justify-between px-6 py-4 bg-gray-2a rounded-lg hover:bg-gray-333 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <BsPhone className="w-6 h-6 text-accent-cyan" />
            <div className="text-left">
              <h3 className="text-white font-medium">Phone Login</h3>
              <p className="text-sm text-gray-400">
                Login with mobile number and OTP
              </p>
            </div>
          </div>
        </button>
        */}
      </div>
    </AuthModal>
  );
};

export default LoginMethodModal;

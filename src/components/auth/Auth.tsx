import { useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import LoginMethodModal from './LoginMethodModal';
import PhoneLoginModal from './PhoneLoginModal';
import OtpModal from './OtpModal';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'method' | 'email-login' | 'phone-login' | 'otp' | 'signup';

const Auth = ({ isOpen, onClose }: AuthProps) => {
  const [mode, setMode] = useState<AuthMode>('method');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleClose = () => {
    onClose();
    // Reset to method selection mode after animation completes
    setTimeout(() => {
      setMode('method');
      setPhoneNumber('');
    }, 200);
  };

  const handlePhoneLogin = (phone: string) => {
    setPhoneNumber(phone);
    setMode('otp');
  };

  const handleVerificationComplete = () => {
    // Handle successful verification (e.g., update auth state, redirect)
    handleClose();
  };

  return (
    <>
      <LoginMethodModal
        isOpen={isOpen && mode === 'method'}
        onClose={handleClose}
        onEmailLogin={() => setMode('email-login')}
        onPhoneLogin={() => setMode('phone-login')}
      />

      <LoginModal
        isOpen={isOpen && mode === 'email-login'}
        onClose={handleClose}
        onSignupClick={() => setMode('signup')}
      />

      <PhoneLoginModal
        isOpen={isOpen && mode === 'phone-login'}
        onClose={handleClose}
        onOtpSent={handlePhoneLogin}
      />

      <OtpModal
        isOpen={isOpen && mode === 'otp'}
        onClose={handleClose}
        phoneNumber={phoneNumber}
        onVerificationComplete={handleVerificationComplete}
      />

      <SignupModal
        isOpen={isOpen && mode === 'signup'}
        onClose={handleClose}
        onLoginClick={() => setMode('method')}
      />
    </>
  );
};

export default Auth;

import { useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
// import LoginMethodModal from './LoginMethodModal'; // Temporarily disabled
// import PhoneLoginModal from './PhoneLoginModal'; // Temporarily disabled
// import OtpModal from './OtpModal'; // Temporarily disabled

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode =
  | 'method'
  | 'email-login'
  | /* 'phone-login' | 'otp' | */ 'signup';

const Auth = ({ isOpen, onClose }: AuthProps) => {
  const [mode, setMode] = useState<AuthMode>('email-login'); // Changed from 'method' to 'email-login'
  // const [phoneNumber, setPhoneNumber] = useState(''); // Temporarily disabled

  const handleClose = () => {
    onClose();
    // Reset to email login mode after animation completes
    setTimeout(() => {
      setMode('email-login'); // Changed from 'method' to 'email-login'
      // setPhoneNumber(''); // Temporarily disabled
    }, 200);
  };

  // Phone login functions temporarily disabled
  /*
  const handlePhoneLogin = (phone: string) => {
    setPhoneNumber(phone);
    setMode('otp');
  };

  const handleVerificationComplete = () => {
    // Handle successful verification (e.g., update auth state, redirect)
    handleClose();
  };
  */

  return (
    <>
      {/* Phone login method selection temporarily disabled - going directly to email login
      <LoginMethodModal
        isOpen={isOpen && mode === 'method'}
        onClose={handleClose}
        onEmailLogin={() => setMode('email-login')}
        // onPhoneLogin={() => setMode('phone-login')} // Temporarily disabled
      />
      */}

      <LoginModal
        isOpen={isOpen && mode === 'email-login'}
        onClose={handleClose}
        onSignupClick={() => setMode('signup')}
      />

      {/* Phone Login temporarily disabled
      <PhoneLoginModal
        // isOpen={isOpen && mode === 'phone-login'} // Temporarily disabled
        onClose={handleClose}
        onOtpSent={handlePhoneLogin}
      />

      OTP Modal temporarily disabled
      <OtpModal
        isOpen={isOpen && mode === 'otp'}
        onClose={handleClose}
        phoneNumber={phoneNumber}
        onVerificationComplete={handleVerificationComplete}
      />
      */}

      <SignupModal
        isOpen={isOpen && mode === 'signup'}
        onClose={handleClose}
        onLoginClick={() => setMode('email-login')}
      />
    </>
  );
};

export default Auth;

import { useForm } from 'react-hook-form';
import AuthModal from './AuthModal';
import OtpInput from 'react-otp-input';
import { useState } from 'react';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerificationComplete: () => void;
}

interface OtpFormData {
  otp: string;
}

const OtpModal = ({
  isOpen,
  onClose,
  phoneNumber,
  onVerificationComplete,
}: OtpModalProps) => {
  const [otp, setOtp] = useState('');
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<OtpFormData>();

  const onSubmit = async (data: OtpFormData) => {
    try {
      // Here you would typically make an API call to verify OTP
      console.log('Verifying OTP:', otp);
      onVerificationComplete();
    } catch (error) {
      setError('otp', {
        type: 'manual',
        message: 'Invalid OTP. Please try again.',
      });
    }
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter Verification Code"
      subtitle={`We've sent a verification code to ${phoneNumber}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                className="!w-12 !h-12 !bg-[#2A2A2A] text-white border-0 rounded-lg mx-1 text-center text-xl"
              />
            )}
            containerStyle="justify-center"
          />
          {errors.otp && (
            <p className="mt-2 text-sm text-red-500 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full bg-[#00C2FF] text-black font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Verifying...' : 'VERIFY'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Didn't receive the code?{' '}
              <button
                type="button"
                className="text-[#00C2FF] hover:underline"
                onClick={() => {
                  // Handle resend logic
                }}
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </form>
    </AuthModal>
  );
};

export default OtpModal;

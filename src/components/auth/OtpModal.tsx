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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: OtpFormData) => {
    try {
      // Here you would typically make an API call to verify OTP
      console.log('Verifying OTP:', otp);
      onVerificationComplete();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errorMsg = error; // Acknowledge error variable
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
                className="!w-12 !h-12 !bg-gray-2a text-white border-0 rounded-lg mx-1 text-center text-xl"
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
            className="w-full bg-accent-cyan text-black font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Verifying...' : 'VERIFY'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                className="text-accent-cyan hover:underline"
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

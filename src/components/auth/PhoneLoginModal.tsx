import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthModal from './AuthModal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOtpSent: (phone: string) => void;
}

interface PhoneLoginFormData {
  phoneNumber: string;
}

const PhoneLoginModal = ({
  isOpen,
  onClose,
  onOtpSent,
}: PhoneLoginModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<PhoneLoginFormData>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: PhoneLoginFormData) => {
    try {
      // Here you would typically make an API call to send OTP
      console.log('Sending OTP to:', phoneNumber);
      onOtpSent(phoneNumber);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errorMsg = error; // Acknowledge error variable
      setError('phoneNumber', {
        type: 'manual',
        message: 'Failed to send OTP. Please try again.',
      });
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    clearErrors('phoneNumber');
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      title="Log In with Your Mobile Number"
      subtitle="No Password Needed – Just Your Phone Number"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="relative">
            <PhoneInput
              country={'in'}
              value={phoneNumber}
              onChange={handlePhoneChange}
              inputClass="!w-full !h-12 !bg-gray-2a !text-white !border-0 !pl-[52px] !rounded-lg"
              buttonClass="!bg-gray-2a !border-0 !rounded-l-lg"
              dropdownClass="!bg-gray-2a !text-white"
              containerClass="!bg-gray-2a rounded-lg"
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-6">
            Add your mobile number. We will send you a verification code to
            verify your mobile number.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || !phoneNumber}
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-cyan-dark text-black font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'SEND OTP'}
          </button>
        </div>
      </form>
    </AuthModal>
  );
};

export default PhoneLoginModal;

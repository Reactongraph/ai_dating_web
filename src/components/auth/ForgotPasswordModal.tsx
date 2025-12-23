import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthModal from './AuthModal';
import { useForgotPasswordMutation } from '@/redux/services/authApi';
import { useSnackbar } from '@/providers';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordModal = ({ isOpen, onClose, onLoginClick }: ForgotPasswordModalProps) => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { showSnackbar } = useSnackbar();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data).unwrap();

      if (response.statusCode === 200) {
        setIsSuccess(true);
        showSnackbar(response.message || 'Password reset link has been sent to your email.', 'success');
        reset();
      }
    } catch (err: unknown) {
      console.error('Forgot password failed:', err);
      const errorMessage =
        typeof err === 'object' && err !== null && 'data' in err
          ? (err.data as { message?: string })?.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? (err as Error).message
            : 'Failed to send password reset link. Please try again.';
      showSnackbar(errorMessage || 'Failed to send password reset link. Please try again.', 'error');
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    reset();
    onClose();
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      {isSuccess ? (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400 text-xs md:text-sm">
              If an account exists with this email, a password reset link has been sent. Please check your email inbox.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-cyan-dark text-black font-bold py-2.5 md:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm md:text-base"
          >
            Close
          </button>
          <p className="text-center text-gray-400 text-xs md:text-sm">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                onLoginClick();
              }}
              className="text-accent-cyan font-semibold hover:underline"
            >
              Back to Login
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">
              Email id
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full bg-gray-2a text-white px-4 py-2.5 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan text-sm md:text-base"
            />
            {errors.email && <p className="mt-1 text-[10px] md:text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-cyan-dark text-black font-bold py-2.5 md:py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base shadow-lg"
          >
            {isLoading ? 'Sending...' : 'SEND RESET LINK'}
          </button>

          <p className="text-center text-gray-400 text-xs md:text-sm">
            Remember your password?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-accent-cyan font-semibold hover:underline"
            >
              Back to Login
            </button>
          </p>
        </form>
      )}
    </AuthModal>
  );
};

export default ForgotPasswordModal;


import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthModal from './AuthModal';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { IoChevronDownOutline } from 'react-icons/io5';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

interface SignupFormData {
  fullName: string;
  email: string;
  gender: 'Man' | 'Woman' | 'Other';
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
  aboutMe: string;
  agreeToTerms: boolean;
}

const SignupModal = ({ isOpen, onClose, onLoginClick }: SignupModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>();

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Here you would typically make an API call to register
      console.log('Signing up with:', data);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleAboutMeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCharCount(text.length);
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      title="Let's Get to Know You"
      subtitle="Just a few quick questions to make your experience awesome!"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm text-gray-400 mb-2"
            >
              Full Name
            </label>
            <input
              {...register('fullName', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              type="text"
              id="fullName"
              placeholder="Full Name"
              className="w-full bg-gray-2a text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
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
              placeholder="Enter Your email"
              className="w-full bg-gray-2a text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Select Gender
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['Man', 'Woman', 'Other'].map((gender) => (
              <label
                key={gender}
                className={`
                  flex items-center justify-center px-4 py-3 rounded-lg cursor-pointer
                  ${watch('gender') === gender ? 'bg-accent-cyan text-black' : 'bg-gray-2a text-white'}
                `}
              >
                <input
                  type="radio"
                  {...register('gender', {
                    required: 'Please select your gender',
                  })}
                  value={gender}
                  className="hidden"
                />
                {gender}
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm text-gray-400 mb-2"
          >
            Date of Birth
          </label>
          <div className="relative">
            <input
              {...register('dateOfBirth', {
                required: 'Date of birth is required',
              })}
              type="text"
              id="dateOfBirth"
              placeholder="dd/mm/yyyy"
              className="w-full bg-gray-2a text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => (e.target.type = 'text')}
            />
            <IoChevronDownOutline
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Your age cannot be changed later
          </p>
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-500">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm text-gray-400 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    'Password must contain uppercase, lowercase, number and special character',
                },
              })}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="********"
              className="w-full bg-gray-2a text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <IoEyeOffOutline size={20} />
              ) : (
                <IoEyeOutline size={20} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm text-gray-400 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'The passwords do not match',
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="********"
              className="w-full bg-gray-2a text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? (
                <IoEyeOffOutline size={20} />
              ) : (
                <IoEyeOutline size={20} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="aboutMe" className="block text-sm text-gray-400 mb-2">
            About Me
          </label>
          <textarea
            {...register('aboutMe')}
            id="aboutMe"
            rows={4}
            placeholder="Write something about your self..."
            className="w-full bg-gray-2a text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan resize-none"
            maxLength={300}
            onChange={handleAboutMeChange}
          />
          <p className="text-right text-sm text-gray-500">
            {charCount}/300 Characters
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('agreeToTerms', {
              required: 'You must agree to the terms and conditions',
            })}
            id="agreeToTerms"
            className="rounded bg-gray-2a border-gray-600 text-accent-cyan focus:ring-accent-cyan"
          />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-400">
            I agree with the{' '}
            <a href="/privacy" className="text-white underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/terms" className="text-white underline">
              Terms & Conditions
            </a>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-accent-cyan to-accent-cyan-dark text-black font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          Submit
        </button>
      </form>
    </AuthModal>
  );
};

export default SignupModal;

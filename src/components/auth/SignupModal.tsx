import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import AuthModal from './AuthModal';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import { useSignupMutation } from '@/redux/services/authApi';
import { useGoogleLoginMutation } from '@/redux/services/googleAuthApi';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSnackbar } from '@/providers';
import { signIn, useSession } from 'next-auth/react';
import { setCredentials } from '@/redux/slices/authSlice';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  countryCode: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  agreeToTerms: boolean;
}

const SignupModal = ({ isOpen, onClose, onLoginClick }: SignupModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signup, { isLoading }] = useSignupMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const authState = useAppSelector(state => state.auth);
  const error = (authState as { error?: string | null })?.error ?? null;
  const requiresVerification =
    (authState as { requiresVerification?: boolean })?.requiresVerification ?? false;
  const isAuthenticated = (authState as { isAuthenticated?: boolean })?.isAuthenticated ?? false;
  const { showSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const hasShownSuccessRef = useRef(false);
  const previousErrorRef = useRef<string | null>(null);
  const hasShownErrorInSubmitRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      countryCode: '+1', // Default to US country code
    },
  });

  const password = watch('password');

  // Close modal when successfully authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  // Show success message and redirect to login after successful signup
  // Note: This is handled in onSubmit now, so we only use this as a fallback
  useEffect(() => {
    if (requiresVerification && isOpen) {
      // Only show if modal is still open (to avoid duplicate messages)
      const timer = setTimeout(() => {
        onLoginClick();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [requiresVerification, onLoginClick, isOpen]);

  // Show error message if there is an error (only show actual error strings)
  // Skip if we just successfully signed up (requiresVerification is true means success)
  useEffect(() => {
    // Reset refs when modal opens
    if (isOpen) {
      hasShownSuccessRef.current = false;
      previousErrorRef.current = null;
      hasShownErrorInSubmitRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    // Skip showing error from Redux state for signup - we handle it in onSubmit
    // Only show if it's a meaningful error message (not generic RTK Query messages)
    if (
      error &&
      typeof error === 'string' &&
      error.trim() !== '' &&
      error !== 'rejected' &&
      error !== 'Rejected' &&
      !error.includes('executeMutation') &&
      isOpen &&
      !requiresVerification && // Don't show error if signup was successful
      error !== previousErrorRef.current && // Don't show same error twice
      !hasShownSuccessRef.current && // Don't show error if we just showed success
      !hasShownErrorInSubmitRef.current // Don't show error if we already showed it in onSubmit
    ) {
      previousErrorRef.current = error;
      showSnackbar(error, 'error');
    }
  }, [error, showSnackbar, isOpen, requiresVerification]);

  // Handle Google session - only when modal is open
  useEffect(() => {
    const handleGoogleSession = async () => {
      // Only process Google session when modal is open and user is not authenticated
      if (isOpen && session && session.user && !isAuthenticated) {
        try {
          // Send the session data to our backend for verification and user creation/login
          const response = await googleLogin({
            token: (session as { accessToken?: string }).accessToken || '',
            email: session.user.email || '',
            name: session.user.name || '',
            picture: session.user.image || undefined,
            googleId: (session as { userId?: string }).userId || '',
          }).unwrap();

          // Handle both direct token response and standard API response
          if (response.token || (response.statusCode === 200 && response.accessToken)) {
            // Cast to LoginResponse to satisfy type checker
            dispatch(
              setCredentials(
                response as unknown as import('@/redux/services/authApi').LoginResponse,
              ),
            );
            showSnackbar('Google signup successful!', 'success');
          }
        } catch (err) {
          console.error('Google signup failed:', err);
          showSnackbar('Google signup failed. Please try again.', 'error');
        }
      }
    };

    handleGoogleSession();
  }, [isOpen, session, dispatch, googleLogin, isAuthenticated, showSnackbar]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Only pass the required parameters to the API
      // Use firstName as fullName for the API
      const signupData = {
        firstName: `${data.firstName} ${data.lastName}`.trim(), // Combine as fullName
        email: data.email,
        password: data.password,
        phone: data.phoneNumber ? Number(data.phoneNumber) : undefined,
        countryCode: data.countryCode
          ? Number(data.countryCode) // Convert "+1" to 1 for API
          : undefined,
        birthDate: data.dateOfBirth,
        gender: data.gender as 'man' | 'woman' | 'other',
      };

      // The signup mutation will automatically update the Redux store
      const response = await signup(signupData).unwrap();

      // Handle successful signup response with statusCode 201
      if (response.statusCode === 201) {
        // Mark that we've shown success to prevent duplicate snackbars
        hasShownSuccessRef.current = true;

        // Show success message from response (only once)
        showSnackbar(
          response.message ||
            'Account created successfully! Please check your email to verify your account before logging in.',
          'success',
          8000,
        );

        // Reset form state
        reset();

        // Wait a bit before closing and redirecting to login
        setTimeout(() => {
          onClose();
          onLoginClick();
        }, 2000);
      }
    } catch (err: unknown) {
      console.error('Signup failed:', err);
      // Mark that we've shown error in submit to prevent duplicate snackbars
      hasShownErrorInSubmitRef.current = true;

      // Show error message
      const errorMessage =
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof err.data === 'object' &&
        err.data !== null &&
        'message' in err.data
          ? (err.data.message as string)
          : typeof err === 'object' && err !== null && 'message' in err
            ? (err as Error).message
            : 'Signup failed. Please try again.';

      if (errorMessage) {
        previousErrorRef.current = errorMessage;
        showSnackbar(errorMessage, 'error');

        // Clear the error ref after a delay to allow for new errors
        setTimeout(() => {
          hasShownErrorInSubmitRef.current = false;
        }, 1000);
      }
    }
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Your Account"
      subtitle="Sign up to start your AI journey."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label htmlFor="firstName" className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">
              First Name
            </label>
            <input
              {...register('firstName', {
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters',
                },
              })}
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              className="w-full bg-gray-2a text-white px-4 py-2.5 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan text-sm md:text-base"
            />
            {errors.firstName && (
              <p className="mt-1 text-[10px] md:text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">
              Last Name
            </label>
            <input
              {...register('lastName')}
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              className="w-full bg-gray-2a text-white px-4 py-2.5 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan text-sm md:text-base"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">
            Email
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

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">
            Phone Number (Optional)
          </label>
          <div className="flex gap-2">
            {/* Country Code Dropdown */}
            <div className="relative w-24 sm:w-28">
              <select
                {...register('countryCode')}
                id="countryCode"
                className="w-full bg-gray-2a text-white px-2 sm:px-3 py-2.5 md:py-3 text-xs md:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan appearance-none pr-7 md:pr-8"
              >
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+91">+91 (IN)</option>
                <option value="+86">+86 (CN)</option>
                <option value="+81">+81 (JP)</option>
                <option value="+49">+49 (DE)</option>
                <option value="+33">+33 (FR)</option>
                <option value="+39">+39 (IT)</option>
                <option value="+34">+34 (ES)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+55">+55 (BR)</option>
                <option value="+52">+52 (MX)</option>
                <option value="+7">+7 (RU)</option>
                <option value="+82">+82 (KR)</option>
                <option value="+65">+65 (SG)</option>
                <option value="+971">+971 (AE)</option>
                <option value="+966">+966 (SA)</option>
                <option value="+27">+27 (ZA)</option>
                <option value="+234">+234 (NG)</option>
                <option value="+20">+20 (EG)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 md:pr-2 pointer-events-none">
                <svg
                  className="w-3 h-3 md:w-4 md:h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {/* Phone Number Input */}
            <div className="flex-1">
              <input
                {...register('phoneNumber')}
                type="tel"
                id="phoneNumber"
                placeholder="Enter your phone number"
                className="w-full bg-gray-2a text-white px-4 py-2.5 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan text-sm md:text-base"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">
              Date of Birth (Optional)
            </label>
            <input
              {...register('dateOfBirth')}
              type="date"
              id="dateOfBirth"
              className="w-full bg-gray-2a text-white px-4 py-2.5 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan text-sm md:text-base"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">
              Gender (Optional)
            </label>
            <select
              {...register('gender')}
              id="gender"
              className="w-full bg-gray-2a text-white px-4 py-2.5 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan text-sm md:text-base"
            >
              <option value="">Select gender</option>
              <option value="man">Male</option>
              <option value="woman">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Create a password"
              className="w-full bg-gray-2a text-white px-4 py-2.5 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan text-sm md:text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <IoEyeOffOutline size={18} className="md:w-[20px] md:h-[20px]" /> : <IoEyeOutline size={18} className="md:w-[20px] md:h-[20px]" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[10px] md:text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match',
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full bg-gray-2a text-white px-4 py-2.5 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan text-sm md:text-base"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <IoEyeOffOutline size={18} className="md:w-[20px] md:h-[20px]" /> : <IoEyeOutline size={18} className="md:w-[20px] md:h-[20px]" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-[10px] md:text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              {...register('agreeToTerms', {
                required: 'You must agree to the terms and conditions',
              })}
              id="agreeToTerms"
              type="checkbox"
              className="w-4 h-4 accent-accent-cyan cursor-pointer rounded bg-gray-2a border-gray-700"
            />
          </div>
          <div className="ml-3 text-xs md:text-sm">
            <label htmlFor="agreeToTerms" className="text-gray-400 cursor-pointer">
              I agree to the{' '}
              <a href="/terms" className="text-accent-cyan font-medium hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-accent-cyan font-medium hover:underline">
                Privacy Policy
              </a>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-[10px] md:text-sm text-red-500">{errors.agreeToTerms.message}</p>
            )}
          </div>
        </div>

        {/* Success and error messages are now handled by the Snackbar component */}

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading || requiresVerification}
          className="w-full bg-gradient-to-r from-accent-cyan to-accent-cyan-dark text-black font-bold py-2.5 md:py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base shadow-lg"
        >
          {isLoading ? 'Creating Account...' : 'SIGN UP'}
        </button>

        <div className="relative my-2 md:my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-[10px] md:text-sm uppercase tracking-wider">
            <span className="px-3 bg-gray-1a text-gray-400">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            // Force account selection by adding timestamp to prevent caching
            const timestamp = Date.now();
            signIn('google', {
              prompt: 'select_account',
              callbackUrl: `${window.location.origin}?google_auth=${timestamp}`,
            });
          }}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center space-x-2 border border-gray-700 text-white px-4 py-2.5 md:py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          <FcGoogle size={18} className="md:w-[20px] md:h-[20px]" />
          <span>{isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}</span>
        </button>

        <p className="text-center text-gray-400 text-xs md:text-sm mt-2">
          Already have an account?{' '}
          <button type="button" onClick={onLoginClick} className="text-accent-cyan font-semibold hover:underline">
            Login
          </button>
        </p>
      </form>
    </AuthModal>
  );
};

export default SignupModal;

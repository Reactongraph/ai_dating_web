import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AuthModal from './AuthModal';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import { useLoginMutation } from '@/redux/services/authApi';
import { useGoogleLoginMutation } from '@/redux/services/googleAuthApi';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSnackbar } from '@/providers';
import { signIn, useSession } from 'next-auth/react';
import { setCredentials } from '@/redux/slices/authSlice';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const LoginModal = ({ isOpen, onClose, onSignupClick }: LoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();
  const { error, requiresVerification, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const { showSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // Close modal when successfully authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  // Show error message if there is an error
  useEffect(() => {
    if (error) {
      showSnackbar(error, 'error');
    }
  }, [error, showSnackbar]);

  // Show verification message if required
  useEffect(() => {
    if (requiresVerification) {
      showSnackbar(
        'Please verify your email address before logging in.',
        'warning'
      );
    }
  }, [requiresVerification, showSnackbar]);

  // Handle Google session - only when modal is open
  useEffect(() => {
    const handleGoogleSession = async () => {
      // Only process Google session when modal is open and user is not authenticated
      if (isOpen && session && session.user && !isAuthenticated) {
        try {
          // Send the session data to our backend for verification and user creation/login
          const response = await googleLogin({
            token: session.accessToken || '',
            email: session.user.email || '',
            name: session.user.name || '',
            picture: session.user.image || undefined,
            googleId: session.userId || '',
          }).unwrap();

          // Handle both direct token response and standard API response
          if (
            response.token ||
            (response.statusCode === 200 && response.accessToken)
          ) {
            // Cast to LoginResponse to satisfy type checker
            dispatch(
              setCredentials(
                response as unknown as import('@/redux/services/authApi').LoginResponse
              )
            );
            showSnackbar('Google login successful!', 'success');
          }
        } catch (err) {
          console.error('Google login failed:', err);
          showSnackbar('Google login failed. Please try again.', 'error');
        }
      }
    };

    handleGoogleSession();
  }, [isOpen, session, dispatch, googleLogin, isAuthenticated, showSnackbar]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // The login mutation will automatically update the Redux store
      const response = await login(data).unwrap();

      if (response.statusCode === 200) {
        showSnackbar('Login successful!', 'success');
      } else if (response.user && !response.user.isEmailVerified) {
        showSnackbar(
          'Please verify your email address before logging in.',
          'warning'
        );
      }
    } catch (err: unknown) {
      console.error('Login failed:', err);
      // Show error message
      const errorMessage =
        typeof err === 'object' && err !== null && 'data' in err
          ? (err.data as { message?: string })?.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? (err as Error).message
            : 'Login failed. Please try again.';
      showSnackbar(errorMessage || 'Login failed. Please try again.', 'error');
    }
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      title="Log In with Your Account"
      subtitle="Log in to access your world with us."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            placeholder="Enter your email"
            className="w-full bg-gray-2a text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
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
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
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
          {/* Error and verification messages are now handled by the Snackbar component */}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="text-accent-cyan text-sm hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-accent-cyan to-accent-cyan-dark text-black font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'LOGIN'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-1a text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn('google')}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center space-x-2 border border-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle size={20} />
          <span>{isGoogleLoading ? 'Logging in...' : 'Login with Google'}</span>
        </button>

        <p className="text-center text-gray-400">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSignupClick}
            className="text-accent-cyan hover:underline"
          >
            Signup
          </button>
        </p>
      </form>
    </AuthModal>
  );
};

export default LoginModal;

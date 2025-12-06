import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { googleAuthApi } from '../services/googleAuthApi';
import { authApi, LoginResponse } from '../services/authApi';

// Define a type for Google auth response
interface GoogleAuthResponsePayload {
  token?: string;
  email?: string;
  name?: string;
  picture?: string;
  googleId?: string;
  accessToken?: string | { access_token: string };
  user?: LoginResponse['user'];
  statusCode?: number;
  message?: string;
  realtimeImage?: string[];
}

// Define the auth state interface
interface AuthState {
  user: LoginResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  requiresVerification: boolean;
  realtimeImage: string | null;
  error: string | null;
  authModal: {
    isOpen: boolean;
    mode: 'email-login' | 'signup' | 'forgot-password';
  };
}

// Normalize user object to ensure both id and _id are set consistently
const normalizeUser = (user: LoginResponse['user'] | null): LoginResponse['user'] | null => {
  if (!user) return null;

  // Determine the actual ID value - prefer _id if it exists, otherwise use id
  const userId =
    (user as { _id?: string; id?: string })._id || (user as { _id?: string; id?: string }).id;

  if (!userId) {
    console.warn('User object missing both id and _id fields');
    return user;
  }

  // Create normalized user object with both id and _id set to the same value
  return {
    ...user,
    _id: userId,
    id: userId,
  } as LoginResponse['user'];
};

// Get user data from localStorage if available
const getUserFromLocalStorage = (): LoginResponse['user'] | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return normalizeUser(parsed);
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
      }
    }
  }
  return null;
};

// Define the initial state
const initialState: AuthState = {
  user: getUserFromLocalStorage(),
  token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  isAuthenticated: !!(typeof window !== 'undefined' && localStorage.getItem('accessToken')),
  loading: false,
  requiresVerification: false,
  realtimeImage: null,
  error: null,
  authModal: {
    isOpen: false,
    mode: 'email-login',
  },
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Initialize auth state from localStorage
    initializeAuthState: state => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const userDataStr = localStorage.getItem('userData');

        if (token && userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            state.user = normalizeUser(userData);
            state.token = token;
            state.isAuthenticated = true;
          } catch (e) {
            console.error('Error parsing user data during initialization:', e);
            // Clear invalid data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userData');
          }
        }
      }
      // Always clear transient fields on initialization to prevent stale snackbars
      state.loading = false;
      state.requiresVerification = false;
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<LoginResponse | GoogleAuthResponsePayload>) => {
      const payload = action.payload;

      // Handle direct Google response format
      if ('token' in payload && payload.token) {
        // Create a user object from Google data
        const user = {
          _id: payload.googleId || '',
          id: payload.googleId || '',
          name: payload.name || '',
          email: payload.email || '',
          profilePicture: payload.picture || '',
          googleId: payload.googleId || '',
          isEmailVerified: true,
        };

        const normalizedUser = normalizeUser(user as LoginResponse['user']);
        state.user = normalizedUser;
        state.token = payload.token;
        state.isAuthenticated = true;
        state.requiresVerification = false;
        state.error = null;

        // Save token and user data to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', payload.token);
          localStorage.setItem('userData', JSON.stringify(normalizedUser));
        }
      }
      // Handle standard API response format
      else if (
        'statusCode' in payload &&
        payload.statusCode === 200 &&
        payload.user &&
        payload.accessToken
      ) {
        const accessToken =
          typeof payload.accessToken === 'string'
            ? payload.accessToken
            : payload.accessToken.access_token;

        const normalizedUser = normalizeUser(payload.user);
        state.user = normalizedUser;
        state.token = accessToken;
        state.isAuthenticated = true;
        state.requiresVerification = false;
        state.realtimeImage = payload.realtimeImage?.length ? payload.realtimeImage[0] : null;

        // Save token and user data to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('userData', JSON.stringify(normalizedUser));
        }
      } else if (
        ('requiresVerification' in payload && payload.requiresVerification) ||
        (payload.user && 'isEmailVerified' in payload.user && !payload.user.isEmailVerified)
      ) {
        state.requiresVerification = true;
        state.error = payload.message || 'Email verification required';
      }
    },
    clearCredentials: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.requiresVerification = false;
      state.realtimeImage = null;
      state.error = null;

      // Remove token and user data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    openAuthModal: (
      state,
      action: PayloadAction<{ mode?: 'email-login' | 'signup' | 'forgot-password' } | undefined>,
    ) => {
      state.authModal.isOpen = true;
      state.authModal.mode = action.payload?.mode || 'email-login';
    },
    closeAuthModal: state => {
      state.authModal.isOpen = false;
    },
  },
  // Add extra reducers to handle API responses
  extraReducers: builder => {
    builder
      // Clear transient fields when Redux rehydrates from persistence
      .addCase(REHYDRATE, state => {
        // Clear transient fields that shouldn't persist across page reloads
        state.loading = false;
        state.requiresVerification = false;
        state.error = null;
      })
      // Login pending
      .addMatcher(authApi.endpoints.login.matchPending, state => {
        state.loading = true;
        state.error = null;
      })
      // Google Login success
      .addMatcher(googleAuthApi.endpoints.googleLogin.matchFulfilled, (state, { payload }) => {
        state.loading = false;

        // Handle direct Google response format
        if (payload.token) {
          // Create a user object from Google data
          const user = {
            _id: payload.googleId || '',
            id: payload.googleId || '',
            name: payload.name || '',
            email: payload.email || '',
            profilePicture: payload.picture || '',
            googleId: payload.googleId || '',
            isEmailVerified: true,
          };

          const normalizedUser = normalizeUser(user as LoginResponse['user']);
          state.user = normalizedUser;
          state.token = payload.token;
          state.isAuthenticated = true;
          state.requiresVerification = false;
          state.error = null;

          // Save token and user data to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', payload.token);
            localStorage.setItem('userData', JSON.stringify(normalizedUser));
          }
        }
        // Handle standard API response format
        else if (payload.statusCode === 200 && payload.user && payload.accessToken) {
          const accessToken =
            typeof payload.accessToken === 'string'
              ? payload.accessToken
              : payload.accessToken.access_token;

          const normalizedUser = normalizeUser(payload.user);
          state.user = normalizedUser;
          state.token = accessToken;
          state.isAuthenticated = true;
          state.requiresVerification = false;
          state.realtimeImage = payload.realtimeImage?.length ? payload.realtimeImage[0] : null;

          // Save token and user data to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userData', JSON.stringify(normalizedUser));
          }
        }
      })
      // Google Login error
      .addMatcher(googleAuthApi.endpoints.googleLogin.matchRejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Google login failed';
      })
      // Login success
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.loading = false;

        if (payload.statusCode === 200 && payload.user && payload.accessToken?.access_token) {
          const normalizedUser = normalizeUser(payload.user);
          state.user = normalizedUser;
          state.token = payload.accessToken.access_token;
          state.isAuthenticated = true;
          state.requiresVerification = false;
          state.realtimeImage = payload.realtimeImage?.length ? payload.realtimeImage[0] : null;

          // Save token and user data to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', payload.accessToken.access_token);
            localStorage.setItem('userData', JSON.stringify(normalizedUser));
          }
        } else if (
          payload.requiresVerification ||
          (payload.user && !payload.user.isEmailVerified)
        ) {
          state.requiresVerification = true;
          state.error = payload.message || 'Email verification required';
        } else {
          state.error = payload.message || 'Login failed';
        }
      })
      // Login error
      .addMatcher(authApi.endpoints.login.matchRejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Login failed';
      })
      // Signup pending
      .addMatcher(authApi.endpoints.signup.matchPending, state => {
        state.loading = true;
        state.error = null;
      })
      // Signup success
      .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, { payload }) => {
        state.loading = false;

        // Handle signup response - check for statusCode 201 (success) or success flag
        if (payload.statusCode === 201 || payload.success) {
          // For signup, we don't set the user/token yet as it requires email verification
          state.requiresVerification = payload.emailSent || false;
          state.error = null; // Clear any previous errors
        } else {
          // Only set error if signup actually failed
          state.error = payload.message || 'Signup failed';
        }
      })
      // Signup error
      .addMatcher(authApi.endpoints.signup.matchRejected, state => {
        state.loading = false;
        // Don't set error state for signup - we handle errors in SignupModal component
        // This prevents duplicate error snackbars
        state.error = null;
      })
      // Logout success
      .addMatcher(authApi.endpoints.logout.matchFulfilled, state => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.requiresVerification = false;
        state.realtimeImage = null;

        // Remove token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userData');
        }
      })
      // Verify token success
      .addMatcher(authApi.endpoints.verifyToken.matchFulfilled, (state, { payload }) => {
        state.loading = false;

        if (payload.valid && payload.user) {
          const normalizedUser = normalizeUser(payload.user);
          state.user = normalizedUser;
          state.isAuthenticated = true;

          // Update localStorage with normalized user data
          if (typeof window !== 'undefined' && normalizedUser) {
            localStorage.setItem('userData', JSON.stringify(normalizedUser));
          }
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;

          // Remove invalid token and user data from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userData');
          }
        }
      })
      // Verify session success (for Google auth)
      .addMatcher(googleAuthApi.endpoints.verifySession.matchFulfilled, (state, { payload }) => {
        state.loading = false;

        // Handle direct token response format
        if (payload.token) {
          // Create a user object from Google data
          const user = {
            _id: payload.googleId || '',
            id: payload.googleId || '',
            name: payload.name || '',
            email: payload.email || '',
            profilePicture: payload.picture || '',
            googleId: payload.googleId || '',
            isEmailVerified: true,
          };

          const normalizedUser = normalizeUser(user as LoginResponse['user']);
          state.user = normalizedUser;
          state.token = payload.token;
          state.isAuthenticated = true;
          state.requiresVerification = false;
          state.error = null;

          // Save token and user data to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', payload.token);
            localStorage.setItem('userData', JSON.stringify(normalizedUser));
          }
        }
        // Handle standard API response format
        else if (payload.statusCode === 200 && payload.user && payload.accessToken) {
          const accessToken =
            typeof payload.accessToken === 'string'
              ? payload.accessToken
              : payload.accessToken.access_token;

          const normalizedUser = normalizeUser(payload.user);
          state.user = normalizedUser;
          state.token = accessToken;
          state.isAuthenticated = true;
          state.requiresVerification = false;
          state.realtimeImage = payload.realtimeImage?.length ? payload.realtimeImage[0] : null;

          // Save token and user data to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userData', JSON.stringify(normalizedUser));
          }
        }
      })
      // Verify session error
      .addMatcher(googleAuthApi.endpoints.verifySession.matchRejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Session verification failed';
        console.error('Session verification failed:', error);
      });
  },
});

// Export actions
export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  initializeAuthState,
  openAuthModal,
  closeAuthModal,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

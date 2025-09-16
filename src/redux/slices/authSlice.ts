import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, LoginResponse } from '../services/authApi';

// Define the auth state interface
interface AuthState {
  user: LoginResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  requiresVerification: boolean;
  realtimeImage: string | null;
  error: string | null;
}

// Get user data from localStorage if available
const getUserFromLocalStorage = (): LoginResponse['user'] | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
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
  token:
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  isAuthenticated: !!(
    typeof window !== 'undefined' && localStorage.getItem('accessToken')
  ),
  loading: false,
  requiresVerification: false,
  realtimeImage: null,
  error: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Initialize auth state from localStorage
    initializeAuthState: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const userDataStr = localStorage.getItem('userData');

        if (token && userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            state.user = userData;
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
    },
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      if (
        action.payload.statusCode === 200 &&
        action.payload.user &&
        action.payload.accessToken?.access_token
      ) {
        state.user = action.payload.user;
        state.token = action.payload.accessToken.access_token;
        state.isAuthenticated = true;
        state.requiresVerification = false;
        state.realtimeImage = action.payload.realtimeImage?.length
          ? action.payload.realtimeImage[0]
          : null;
        state.error = null;

        // Save token to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'accessToken',
            action.payload.accessToken.access_token
          );
          localStorage.setItem('userData', JSON.stringify(action.payload.user));
        }
      } else if (
        action.payload.requiresVerification ||
        (action.payload.user && !action.payload.user.isEmailVerified)
      ) {
        state.requiresVerification = true;
        state.error = action.payload.message || 'Email verification required';
      }
    },
    clearCredentials: (state) => {
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
  },
  // Add extra reducers to handle API responses
  extraReducers: (builder) => {
    builder
      // Login pending
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Login success
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;

          if (
            payload.statusCode === 200 &&
            payload.user &&
            payload.accessToken?.access_token
          ) {
            state.user = payload.user;
            state.token = payload.accessToken.access_token;
            state.isAuthenticated = true;
            state.requiresVerification = false;
            state.realtimeImage = payload.realtimeImage?.length
              ? payload.realtimeImage[0]
              : null;

            // Save token and user data to localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                'accessToken',
                payload.accessToken.access_token
              );
              localStorage.setItem('userData', JSON.stringify(payload.user));
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
        }
      )
      // Login error
      .addMatcher(authApi.endpoints.login.matchRejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Login failed';
      })
      // Signup pending
      .addMatcher(authApi.endpoints.signup.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Signup success
      .addMatcher(
        authApi.endpoints.signup.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;

          if (payload.success) {
            // For signup, we don't set the user/token yet as it requires email verification
            state.requiresVerification = payload.emailSent || false;
          } else {
            state.error = payload.message || 'Signup failed';
          }
        }
      )
      // Signup error
      .addMatcher(
        authApi.endpoints.signup.matchRejected,
        (state, { error }) => {
          state.loading = false;
          state.error = error.message || 'Signup failed';
        }
      )
      // Logout success
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.requiresVerification = false;
        state.realtimeImage = null;

        // Remove token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
      })
      // Verify token success
      .addMatcher(
        authApi.endpoints.verifyToken.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;

          if (payload.valid && payload.user) {
            state.user = payload.user;
            state.isAuthenticated = true;
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
        }
      );
  },
});

// Export actions
export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
  initializeAuthState,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

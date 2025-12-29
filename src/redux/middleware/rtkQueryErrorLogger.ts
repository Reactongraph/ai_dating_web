import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware, AnyAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { clearCredentials } from '../slices/authSlice';
import { signOut } from 'next-auth/react';

/**
 * RTK Query error payload type
 */
interface RTKQueryErrorPayload {
  status?: number | string;
  data?: {
    message?: string;
    error?: string;
  };
  error?: string;
  name?: string;
}

/**
 * RTK Query meta arg type
 */
interface RTKQueryMetaArg {
  endpointName?: string;
  type?: string;
}

/**
 * RTK Query error logging middleware
 * Catches all RTK Query errors and displays toast notifications
 * Automatically logs out users on 401 unauthorized and 403 forbidden errors (JWT failures)
 */
export const rtkQueryErrorLogger: Middleware = store => next => (action: AnyAction) => {
  // Check if this is a rejected action from RTK Query
  if (isRejectedWithValue(action)) {
    const payload = action.payload as RTKQueryErrorPayload | undefined;

    // Extract error information
    const status = payload?.status;
    const data = payload?.data;
    const error = payload?.error;
    const name = payload?.name;

    // CRITICAL: Handle 401/403 errors IMMEDIATELY before any other checks
    // This ensures logout happens even if other conditions might prevent it
    // Check status from multiple possible locations
    const errorStatus = status || (payload as any)?.status || (data as any)?.statusCode;
    
    if (errorStatus === 401 || errorStatus === 403) {
      // Extract endpoint name quickly for auth endpoint check
      const metaArg = action.meta?.arg as RTKQueryMetaArg | undefined;
      const endpointName = metaArg?.endpointName || (action.meta?.arg as any)?.endpointName;
      const authEndpoints = ['login', 'signup', 'googleLogin', 'telegramLogin', 'verifySession', 'verifyToken'];
      const isAuthEndpoint = endpointName && authEndpoints.includes(endpointName);
      
      if (!isAuthEndpoint) {
        // Clear Redux credentials
        store.dispatch(clearCredentials());
        
        // Clear localStorage immediately
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userData');
          
          // Show logout message
          toast.info('Your session has expired. Redirecting...', {
            position: 'top-right',
            autoClose: 2000,
          });
          
          // Force redirect immediately
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
          
          // Sign out from NextAuth in background
          signOut({
            redirect: false,
            callbackUrl: '/',
          }).catch(() => {
            // Silently handle signOut errors - redirect is already handled above
          });
        }
      }
    }

    // Ignore certain types of errors that shouldn't show toasts:
    // 1. Query cancellation/abortion (happens during navigation/unmounting)
    // 2. Condition skipped queries
    // 3. Aborted fetch requests
    const shouldIgnore =
      !status || // No status means query was cancelled/aborted
      error === 'AbortError' || // Query was aborted
      name === 'AbortError' || // Check name field for AbortError
      error === 'ConditionError' || // Query skipped due to condition
      action.meta?.condition === false || // Query condition was false
      action.meta?.aborted === true; // Query was aborted by RTK Query

    if (shouldIgnore) {
      // Log for debugging but don't show toast
      return next(action);
    }

    let errorMessage = 'An error occurred. Please try again.';

    // Handle different error status codes
    if (status === 400) {
      errorMessage = data?.message || 'Bad request. Please check your input.';
    } else if (status === 401) {
      errorMessage = data?.message || 'Unauthorized. Please login again.';
    } else if (status === 403) {
      errorMessage = data?.message || 'Access forbidden.';
    } else if (status === 404) {
      errorMessage = data?.message || 'Resource not found.';
    } else if (status === 409) {
      errorMessage = data?.message || 'Conflict. Resource already exists.';
    } else if (status === 422) {
      errorMessage = data?.message || 'Validation error.';
    } else if (status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (status === 502) {
      errorMessage = 'Bad gateway. Please try again later.';
    } else if (status === 503) {
      errorMessage = 'Service unavailable. Please try again later.';
    } else if (status === 504) {
      errorMessage = 'Gateway timeout. Please try again later.';
    } else if (status === 'FETCH_ERROR') {
      errorMessage = 'Network error. Please check your connection.';
    } else if (status === 'PARSING_ERROR') {
      errorMessage = 'Error parsing response. Please try again.';
    } else if (status === 'TIMEOUT_ERROR') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (data?.message) {
      errorMessage = data.message;
    }

    // List of endpoints that should NOT show error toasts automatically
    // (they handle errors in their own UI)
    const silentEndpoints = ['login', 'signup', 'googleLogin', 'updateProfile', 'generateAvatar'];

    // List of endpoints that should NOT trigger automatic logout on 401
    // (these endpoints might legitimately return 401 during authentication flow)
    const authEndpoints = ['login', 'signup', 'googleLogin', 'telegramLogin', 'verifySession', 'verifyToken'];

    // Check if this endpoint should be silent
    // RTK Query stores endpoint name in different places depending on the action type
    // Try multiple ways to extract the endpoint name
    const metaArg = action.meta?.arg as RTKQueryMetaArg | undefined;
    const actionTypeParts = action.type?.split('/') || [];
    
    // Extract endpoint name - RTK Query stores it in action.meta.arg.endpointName
    let endpointName: string | undefined = 
      metaArg?.endpointName ||
      (action.meta?.arg as any)?.endpointName; // Try with any type as fallback
    
    // If not found in meta, try to extract from action type
    // RTK Query action types can be: "apiName/endpoints/endpointName/executeQuery/rejected"
    if (!endpointName && actionTypeParts.length >= 3) {
      // Pattern: "apiName/endpoints/endpointName/executeQuery/rejected"
      if (actionTypeParts[1] === 'endpoints') {
        endpointName = actionTypeParts[2];
      }
      // Pattern: "apiName/executeQuery/rejected" - endpoint name might be in a different format
      else if (actionTypeParts[1] === 'executeQuery' || actionTypeParts[1] === 'executeMutation') {
        // Try to get from the action type itself
        endpointName = actionTypeParts[0]?.replace('Api', '').toLowerCase();
      }
    }
    
    // Additional extraction: check if endpoint name is in the originalArg
    if (!endpointName && (action.meta?.arg as any)?.originalArgs) {
      // Sometimes RTK Query stores it differently
      const originalArg = (action.meta?.arg as any)?.originalArgs;
      if (originalArg && typeof originalArg === 'object') {
        // Try to find endpoint name in various places
        endpointName = originalArg.endpointName || originalArg.type;
      }
    }
    
    const actionType = action.type || '';
    const isSignup =
      endpointName === 'signup' ||
      actionTypeParts.some(part => part.toLowerCase().includes('signup')) ||
      actionType.toLowerCase().includes('signup');

    const shouldShowToast = !silentEndpoints.includes(endpointName) && !isSignup;

    // Handle 401 unauthorized and 403 forbidden errors - automatically log out user
    // Skip logout for auth-related endpoints (login, signup, etc.) as they might legitimately return 401
    // 403 errors typically indicate JWT validation failure or invalid session
    let shouldSkipErrorToast = false;
    if (status === 401 || status === 403) {
      // Only skip logout for explicit auth endpoints
      const isAuthEndpoint = endpointName && authEndpoints.includes(endpointName);
      
      // For 401/403 errors, always logout unless it's an auth endpoint
      // This handles cases where endpoint name extraction fails
      if (!isAuthEndpoint) {
        // Clear Redux credentials
        store.dispatch(clearCredentials());
        
        // Clear localStorage immediately
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userData');
          
          // Show logout message
          toast.info('Your session has expired. Redirecting...', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          
          // Force redirect immediately
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
          
          // Sign out from NextAuth in background
          signOut({
            redirect: false,
            callbackUrl: '/',
          }).catch(() => {
            // Silently handle signOut errors - redirect is already handled above
          });
        }
        
        shouldSkipErrorToast = true; // Don't show the error toast for 401/403 when we auto-logout
      }
    }

    // Show toast notification for errors (except for endpoints that handle their own errors)
    // Skip error toast for 401 errors that triggered auto-logout
    if (shouldShowToast && !shouldSkipErrorToast) {
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

  }

  return next(action);
};

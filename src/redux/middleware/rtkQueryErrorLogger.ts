import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

/**
 * RTK Query error logging middleware
 * Catches all RTK Query errors and displays toast notifications
 */
export const rtkQueryErrorLogger: Middleware =
  () => (next) => (action: any) => {
    // Check if this is a rejected action from RTK Query
    if (isRejectedWithValue(action)) {
      const { payload } = action;

      // Log the full action for debugging
      console.log('RTK Query Rejection Details:', {
        type: action.type,
        payload,
        meta: action.meta,
        error: action.error,
      });

      // Extract error information
      const status = payload?.status;
      const data = payload?.data;
      const error = payload?.error;
      const name = payload?.name;

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
        console.log('RTK Query - Ignored rejection:', {
          endpoint: action.meta?.arg?.endpointName,
          reason: 'Query cancelled, aborted, or skipped',
          status,
          error,
          name,
        });
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
      const silentEndpoints = [
        'login',
        'signup',
        'googleLogin',
        'updateProfile',
        'generateAvatar',
      ];

      // Check if this endpoint should be silent
      const endpointName = action.meta?.arg?.endpointName;
      const shouldShowToast = !silentEndpoints.includes(endpointName);

      // Show toast notification for errors (except for endpoints that handle their own errors)
      if (shouldShowToast) {
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      // Log error for debugging
      console.error('RTK Query Error:', {
        endpoint: endpointName,
        status,
        message: errorMessage,
        payload,
      });
    }

    return next(action);
  };

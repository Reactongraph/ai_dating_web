'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import { useTelegramLoginMutation } from '@/redux/services/telegramAuthApi';
import {
  isTelegramMiniApp,
  getTelegramInitData,
  parseTelegramInitData,
} from '@/utils/telegramUtils';

/**
 * Hook for automatic Telegram Mini App authentication
 * Automatically logs in users when app is running in Telegram Mini App environment
 */
export const useTelegramAutoLogin = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [telegramLogin, { isLoading, error }] = useTelegramLoginMutation();
  const hasAttemptedLogin = useRef(false);

  useEffect(() => {
    // Only attempt auto-login once and if not already authenticated
    if (hasAttemptedLogin.current || isAuthenticated) {
      return;
    }

    // Check if we're in a Telegram Mini App environment
    if (!isTelegramMiniApp()) {
      return;
    }

    // Get initData from Telegram WebApp
    const initData = getTelegramInitData();
    if (!initData) {
      console.warn('Telegram Mini App detected but initData is not available');
      return;
    }

    // Parse initData for optional parsedData parameter
    const parsedData = parseTelegramInitData(initData);

    // Attempt automatic login
    const attemptAutoLogin = async () => {
      try {
        hasAttemptedLogin.current = true;

        const response = await telegramLogin({
          initData,
          parsedData,
          referralCode: parsedData?.start_param,
        }).unwrap();

        // Handle both direct token response and standard API response
        if (response.token || (response.statusCode === 200 && response.accessToken)) {
          // Cast to LoginResponse to satisfy type checker
          dispatch(
            setCredentials(response as unknown as import('@/redux/services/authApi').LoginResponse),
          );
          console.log('Telegram auto-login successful');
        } else {
          console.warn('Telegram auto-login response format unexpected:', response);
        }
      } catch (err: any) {
        // Only log error if it's not a user-not-found or similar expected error
        if (err?.status !== 404 && err?.status !== 401) {
          console.error('Telegram auto-login failed:', err);
        }
        // Reset flag on error so we can retry if needed
        hasAttemptedLogin.current = false;
      }
    };

    // Small delay to ensure app is fully initialized
    const timeoutId = setTimeout(() => {
      attemptAutoLogin();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated, telegramLogin, dispatch]);

  return {
    isLoading,
    error,
  };
};

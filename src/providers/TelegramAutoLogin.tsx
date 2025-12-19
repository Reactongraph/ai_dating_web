'use client';

import { useEffect } from 'react';
import { useTelegramAutoLogin } from '@/hooks/useTelegramAutoLogin';
import { initializeTelegramWebApp } from '@/utils/telegramUtils';

/**
 * Component that handles automatic Telegram Mini App authentication
 * This component doesn't render anything, it just triggers the auto-login hook
 */
export function TelegramAutoLogin() {
  // Initialize Telegram WebApp when component mounts
  useEffect(() => {
    // Wait a bit for the script to load, then initialize
    const initTimer = setTimeout(() => {
      initializeTelegramWebApp();
    }, 100);

    return () => clearTimeout(initTimer);
  }, []);

  useTelegramAutoLogin();
  return null;
}

export default TelegramAutoLogin;


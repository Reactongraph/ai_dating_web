'use client';

import { useTelegramAutoLogin } from '@/hooks/useTelegramAutoLogin';

/**
 * Component that handles automatic Telegram Mini App authentication
 * This component doesn't render anything, it just triggers the auto-login hook
 */
export function TelegramAutoLogin() {
  useTelegramAutoLogin();
  return null;
}

export default TelegramAutoLogin;


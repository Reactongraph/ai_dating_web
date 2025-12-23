/**
 * Telegram Mini App utilities
 * Functions to detect Telegram environment and extract initData
 */

// Type definitions for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
            is_premium?: boolean;
          };
          auth_date?: number;
          hash?: string;
          query_id?: string;
          start_param?: string;
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        sendData: (data: string) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        openInvoice: (url: string, callback?: (status: string) => void) => void;
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text?: string;
          }>;
        }, callback?: (id: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showScanQrPopup: (params: {
          text?: string;
        }, callback?: (data: string) => void) => void;
        closeScanQrPopup: () => void;
        readTextFromClipboard: (callback?: (text: string) => void) => void;
        requestWriteAccess: (callback?: (granted: boolean) => void) => void;
        requestContact: (callback?: (granted: boolean) => void) => void;
      };
    };
  }
}

export interface TelegramUser {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
}

export interface ParsedTelegramInitData {
  user?: TelegramUser;
  auth_date?: number;
  hash?: string;
  query_id?: string;
  start_param?: string;
}

/**
 * Initialize Telegram WebApp if available
 * Call this after the SDK script loads to properly initialize the WebApp
 */
export const initializeTelegramWebApp = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (window.Telegram?.WebApp) {
      // Initialize the WebApp
      window.Telegram.WebApp.ready();
      // Expand the WebApp to full height
      window.Telegram.WebApp.expand();
    }
  } catch (error) {
    console.error('Error initializing Telegram WebApp:', error);
  }
};

/**
 * Check if the app is running in a Telegram Mini App environment
 * @returns true if running in Telegram Mini App, false otherwise
 */
export const isTelegramMiniApp = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if Telegram WebApp SDK is available
  const hasTelegramWebApp = !!(
    window.Telegram &&
    window.Telegram.WebApp &&
    window.Telegram.WebApp.initData
  );

  // Additional check: Telegram WebApp usually has specific user agent patterns
  // but initData is the most reliable indicator
  return hasTelegramWebApp;
};

/**
 * Get raw initData from Telegram WebApp
 * Ensures hash is included from initDataUnsafe if missing from initData string
 * @returns Raw initData string with hash or null if not available
 */
export const getTelegramInitData = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!isTelegramMiniApp()) {
    return null;
  }

  try {
    let initData = window.Telegram?.WebApp?.initData;
    
    if (!initData || typeof initData !== 'string' || initData.length === 0) {
      return null;
    }

    // Check if hash is missing from initData string
    const params = new URLSearchParams(initData);
    if (!params.has('hash')) {
      // Get hash from initDataUnsafe
      const hash = window.Telegram?.WebApp?.initDataUnsafe?.hash;
      if (hash && typeof hash === 'string') {
        // Append hash to initData (initData is already a query string, so use &)
        initData = `${initData}&hash=${encodeURIComponent(hash)}`;
      } else {
        console.warn('Hash is missing from initData and not available in initDataUnsafe');
      }
    }

    return initData;
  } catch (error) {
    console.error('Error getting Telegram initData:', error);
    return null;
  }
};

/**
 * Parse Telegram initData query string
 * @param initData - Raw initData string
 * @returns Parsed data object or null if parsing fails
 */
export const parseTelegramInitData = (initData: string): ParsedTelegramInitData | null => {
  if (!initData || typeof initData !== 'string') {
    return null;
  }

  try {
    const params = new URLSearchParams(initData);
    const parsed: ParsedTelegramInitData = {};

    // Parse hash
    if (params.has('hash')) {
      parsed.hash = params.get('hash') || undefined;
    }

    // Parse auth_date
    if (params.has('auth_date')) {
      const authDate = params.get('auth_date');
      parsed.auth_date = authDate ? parseInt(authDate, 10) : undefined;
    }

    // Parse query_id
    if (params.has('query_id')) {
      parsed.query_id = params.get('query_id') || undefined;
    }

    // Parse start_param
    if (params.has('start_param')) {
      parsed.start_param = params.get('start_param') || undefined;
    }

    // Parse user (JSON string)
    if (params.has('user')) {
      try {
        const userStr = params.get('user');
        if (userStr) {
          parsed.user = JSON.parse(userStr) as TelegramUser;
          // Ensure id is a string
          if (parsed.user && parsed.user.id) {
            parsed.user.id = String(parsed.user.id);
          }
        }
      } catch (error) {
        console.error('Error parsing user data from initData:', error);
      }
    }

    return parsed;
  } catch (error) {
    console.error('Error parsing Telegram initData:', error);
    return null;
  }
};

/**
 * Get Telegram user data from initDataUnsafe (for display purposes only, not for auth)
 * @returns Telegram user object or null
 */
export const getTelegramUserUnsafe = (): TelegramUser | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!isTelegramMiniApp()) {
    return null;
  }

  try {
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (user && user.id) {
      return {
        id: String(user.id),
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        language_code: user.language_code,
        photo_url: user.photo_url,
        is_premium: user.is_premium,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting Telegram user data:', error);
    return null;
  }
};


import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiLogIn, FiLogOut, FiUser, FiUserPlus } from 'react-icons/fi';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
// Removed useLogoutMutation import as we don't need to call the API
import { clearCredentials } from '@/redux/slices/authSlice';
import { useSnackbar } from '@/providers';
import { signOut } from 'next-auth/react';
import { RiVipCrownFill } from 'react-icons/ri';

interface DropdownOption {
  icon: React.ReactNode;
  label: string;
  href: string;
  highlight?: boolean;
  badge?: string;
  onClick?: () => void;
}

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const UserDropdown = ({ isOpen, onClose, onLoginClick, onSignupClick }: UserDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      // Clear Redux credentials
      dispatch(clearCredentials());

      // Sign out from NextAuth with callback to clear all session data
      await signOut({
        redirect: false,
        callbackUrl: '/',
      });

      // Clear any remaining session storage and cookies related to NextAuth
      if (typeof window !== 'undefined') {
        // Clear NextAuth session storage
        sessionStorage.removeItem('nextauth.message');
        sessionStorage.removeItem('nextauth.csrfToken');

        // Clear any Google OAuth related cookies
        document.cookie.split(';').forEach(cookie => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          // Clear NextAuth and Google OAuth cookies
          if (name.startsWith('next-auth.') || name.startsWith('__Secure-next-auth.')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          }
        });
      }

      // Show success message
      showSnackbar('Logged out successfully', 'success');
      onClose();

      // Force a page reload to clear any remaining state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      showSnackbar('Error logging out. Please try again.', 'error');
    }
  };

  // Different options based on authentication status
  const options: DropdownOption[] =
    isAuthenticated && user
      ? [
          {
            icon: <FiUser className="w-5 h-5" />,
            label: user.name || 'User Profile',
            href: '/profile',
          },
          // {
          //   icon: <FiSettings className="w-5 h-5" />,
          //   label: 'Account Settings',
          //   href: '/account-settings',
          // },
          {
            icon: <RiVipCrownFill className="w-5 h-5 text-yellow-400" />,
            label: 'Subscription',
            href: '/subscriptions',
            highlight: true,
            badge: user?.subscriber?.isPremiumSubscriber ? 'PREMIUM' : '70%',
          },
          {
            icon: <FiLogOut className="w-5 h-5" />,
            label: 'Logout',
            href: '#',
            onClick: handleLogout,
          },
        ]
      : [
          {
            icon: <FiLogIn className="w-5 h-5" />,
            label: 'Log in',
            href: '#',
            onClick: () => {
              onClose();
              onLoginClick();
            },
          },
          {
            icon: <FiUserPlus className="w-5 h-5" />,
            label: 'Sign up',
            href: '#',
            onClick: () => {
              onClose();
              onSignupClick();
            },
          },
          // {
          //   icon: <RiVipCrownFill className="w-5 h-5 text-yellow-400" />,
          //   label: 'Subscription',
          //   href: '/subscription',
          //   highlight: true,
          //   badge: '70%',
          // },
        ];

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 rounded-lg bg-gray-2a shadow-lg ring-1 ring-black ring-opacity-5 z-50"
    >
      {isAuthenticated && user && (
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="font-medium text-white truncate">{user.name}</div>
          <div className="text-sm text-gray-400 truncate">{user.email}</div>
          {user.subscriber?.isPremiumSubscriber && (
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-400 text-black">
                Premium
              </span>
            </div>
          )}
        </div>
      )}
      <div className="py-2">
        {options.map((option, index) => {
          const commonClasses = `
            ${option.onClick ? 'w-full' : ''} flex items-center justify-between px-4 py-3 hover:bg-gray-700/50 transition-colors
            ${option.highlight ? 'text-yellow-400' : 'text-white'}
          `;

          const content = (
            <>
              <div className="flex items-center space-x-3">
                {option.icon}
                <span className="text-sm font-medium">{option.label}</span>
              </div>
              {option.badge && (
                <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                  {option.badge}
                </span>
              )}
            </>
          );

          return option.onClick ? (
            <button key={index} onClick={option.onClick} className={commonClasses}>
              {content}
            </button>
          ) : (
            <Link key={index} href={option.href} className={commonClasses}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default UserDropdown;

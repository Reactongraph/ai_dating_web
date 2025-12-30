import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserDropdown from './UserDropdown';
import Auth from '../auth/Auth';
import AgeVerificationModal from '../modals/AgeVerificationModal';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectContentMode, setMode } from '@/redux/slices/contentModeSlice';
import { openAuthModal, closeAuthModal } from '@/redux/slices/authSlice';
import { useUpdateProfileMutation, useGetProfileQuery } from '@/redux/services/profileApi';

interface NavBarProps {
  onToggleSidebar: () => void;
  isMobileOpen: boolean;
}

const NavBar = ({ onToggleSidebar, isMobileOpen }: NavBarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, authModal } = useAppSelector(state => state.auth);
  const contentMode = useAppSelector(selectContentMode);
  const dispatch = useAppDispatch();
  const [updateProfile] = useUpdateProfileMutation();

  // Fetch user profile on page load if authenticated
  const { data: profileData } = useGetProfileQuery(user?.id || user?._id || '', {
    skip: !isAuthenticated || (!user?.id && !user?._id), // Skip if not authenticated or no user ID
  });

  useEffect(() => {
    const checkBannerVisibility = () => {
      // Check if banner element exists and is visible
      const mobileTopBanner = document.querySelector('[data-banner="mobile-top"]');
      setIsBannerVisible(!!mobileTopBanner);
    };

    checkBannerVisibility();

    // Set up a mutation observer to detect when banner is removed
    const observer = new MutationObserver(checkBannerVisibility);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [pathname]);

  const handleLoginClick = () => {
    dispatch(openAuthModal({ mode: 'email-login' }));
  };

  const handleSignupClick = () => {
    dispatch(openAuthModal({ mode: 'signup' }));
  };

  // Always ensure content mode is set to 'sfw' on mount
  useEffect(() => {
    dispatch(setMode('sfw'));
  }, [dispatch]);

  const handleToggleContentMode = async () => {
    // If switching from SFW to NSFW, check if user has already verified
    if (contentMode === 'sfw') {
      const hasVerified = localStorage.getItem('ageVerified') === 'true';
      if (hasVerified) {
        // User has already verified, switch directly
        dispatch(setMode('nsfw'));
        // Update backend if user is authenticated
        if (isAuthenticated && user) {
          try {
            await updateProfile({
              userId: user.id || user._id || '',
              data: { isNsfw: true },
            });
          } catch (error) {
            console.error('Failed to update NSFW preference:', error);
          }
        }
      } else {
        // Show verification modal for first time
        setShowAgeVerification(true);
      }
    } else {
      // Switching from NSFW to SFW, no verification needed
      dispatch(setMode('sfw'));
      // Update backend if user is authenticated
      if (isAuthenticated && user) {
        try {
          await updateProfile({
            userId: user.id || user._id || '',
            data: { isNsfw: false },
          });
        } catch (error) {
          console.error('Failed to update NSFW preference:', error);
        }
      }
    }
  };

  const handleAgeVerificationConfirm = async () => {
    // Save verification status to localStorage
    localStorage.setItem('ageVerified', 'true');
    dispatch(setMode('nsfw'));
    setShowAgeVerification(false);

    // Update backend if user is authenticated
    if (isAuthenticated && user) {
      try {
        await updateProfile({
          userId: user.id || user._id || '',
          data: { isNsfw: true },
        });
      } catch (error) {
        console.error('Failed to update NSFW preference:', error);
      }
    }
  };

  const handleAgeVerificationCancel = () => {
    setShowAgeVerification(false);
  };

  // const navLinks = [
  //   { href: '/girls', label: 'Girls' },
  //   { href: '/guys', label: 'Guys' },
  //   // { href: '/anime', label: 'Anime' },
  // ];

  return (
    <>
      <nav
        className={`fixed ${
          !isBannerVisible ? 'top-0' : 'top-[44px] md:top-[52px]'
        } right-0 left-0 md:left-16 h-16 bg-background-primary text-text-primary z-40 transition-all duration-300`}
      >
        <div className="flex items-center justify-between h-full px-2 md:px-4">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-2 md:space-x-8">
            {/* Mobile menu toggle - Hidden since sidebar is removed for mobile */}
            {/* <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white-1a transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button> */}
            <Link href="/" className="text-xl font-bold">
              <Image
                src="/assets/daily_love.png"
                alt="Logo"
                width={170}
                height={50}
                className="object-contain w-auto h-5 sm:h-auto"
              />
            </Link>

            {/* <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative h-16 flex items-center text-md
                    ${pathname === link.href ? 'text-accent-blue' : 'text-text-secondary hover:text-white'}
                    transition-colors
                  `}
                >
                  {link.label}
                  {pathname === link.href && (
                    <div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-blue"
                      style={{ boxShadow: '0 0 8px var(--color-accent-blue)' }}
                    />
                  )}
                </Link>
              ))}
            </div> */}
          </div>

          {/* Right Side - Create AI Character Button and Profile */}
          <div className="flex items-center space-x-2 md:space-x-6">
            {/* <Link
              href="/create-character"
              className="hidden md:block bg-gradient-to-r from-primary-500 to-primary-600 text-white md:text-sm font-semibold px-2 md:px-4 md:py-1.5 rounded-xl hover:opacity-90 transition-colors"
            >
              Create AI Character
            </Link> */}

            {/* SFW/NSFW Toggle Switch */}
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-medium  sm:block ${contentMode === 'sfw' ? 'text-green-400' : 'text-gray-400'}`}
              >
                General
              </span>
              <button
                onClick={handleToggleContentMode}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  contentMode === 'nsfw' ? 'bg-red-600' : 'bg-green-600'
                }`}
                aria-label={`Switch to ${contentMode === 'sfw' ? 'Adult' : 'General22'} mode`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    contentMode === 'nsfw' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span
                className={`text-xs font-medium  sm:block ${contentMode === 'nsfw' ? 'text-red-400' : 'text-gray-400'}`}
              >
                {/*
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-all duration-300"
                >
                  <defs>
                    <linearGradient id="eighteenPlusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop
                        offset="0%"
                        stopColor={contentMode === 'nsfw' ? '#ef4444' : '#6b7280'}
                      />
                      <stop
                        offset="100%"
                        stopColor={contentMode === 'nsfw' ? '#dc2626' : '#4b5563'}
                      />
                    </linearGradient>
                  </defs>*/}
                  {/* Outer circle with gradient */}
                  {/*
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="url(#eighteenPlusGradient)"
                    opacity={contentMode === 'nsfw' ? '1' : '0.6'}
                  />*/}
                  {/* Inner circle for depth */}
                  {/*
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />*/}
                  {/* 18+ text */}
                  {/*
                  <text
                    x="20"
                    y="25"
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                  >
                    18+
                  </text>
                </svg>*/}
                Adult
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-[46px] h-[46px] rounded-full bg-secondary-700 flex items-center justify-center hover:opacity-90 transition-opacity overflow-hidden"
              >
                <div className="relative w-full h-full">
                  {isAuthenticated && user ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-accent-cyan to-accent-cyan-dark text-white font-bold text-lg">
                      {typeof user.name === 'string' && user.name.length > 0
                        ? user.name.charAt(0).toUpperCase()
                        : 'U'}
                    </div>
                  ) : (
                    <Image
                      src="/assets/profile.svg"
                      alt="Profile"
                      width={46}
                      height={46}
                      className="rounded-full"
                    />
                  )}
                </div>
              </button>
              <UserDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onLoginClick={handleLoginClick}
                onSignupClick={handleSignupClick}
              />
            </div>
          </div>
        </div>
      </nav>
      <Auth
        isOpen={authModal.isOpen}
        onClose={() => dispatch(closeAuthModal())}
        initialMode={authModal.mode}
      />
      <AgeVerificationModal
        isOpen={showAgeVerification}
        onClose={handleAgeVerificationCancel}
        onConfirm={handleAgeVerificationConfirm}
      />
    </>
  );
};

export default NavBar;

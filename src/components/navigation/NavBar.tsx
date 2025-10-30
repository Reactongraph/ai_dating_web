import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserDropdown from './UserDropdown';
import Auth from '../auth/Auth';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

interface NavBarProps {
  onToggleSidebar: () => void;
  isMobileOpen: boolean;
}

const NavBar = ({ onToggleSidebar, isMobileOpen }: NavBarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'email-login' | 'signup'>(
    'email-login'
  );
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  // Check if banner is visible and adjust navbar position
  useEffect(() => {
    const checkBannerVisibility = () => {
      // Check if banner element exists (not on homepage) and is visible
      const banner = document.querySelector('[data-banner="chips"]');
      setIsBannerVisible(!!banner);
    };

    checkBannerVisibility();

    // Set up a mutation observer to detect when banner is removed
    const observer = new MutationObserver(checkBannerVisibility);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [pathname]);

  const handleLoginClick = () => {
    setAuthMode('email-login');
    setIsAuthOpen(true);
  };

  const handleSignupClick = () => {
    setAuthMode('signup');
    setIsAuthOpen(true);
  };

  // const navLinks = [
  //   { href: '/girls', label: 'Girls' },
  //   { href: '/guys', label: 'Guys' },
  //   // { href: '/anime', label: 'Anime' },
  // ];

  return (
    <>
      <nav
        className={`fixed ${!isBannerVisible || pathname === '/' ? 'top-0' : 'top-[40px]'} right-0 left-0 md:left-16 h-16 bg-background-primary text-text-primary z-40 transition-all duration-300`}
      >
        <div className="flex items-center justify-between h-full px-2 md:px-4">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-2 md:space-x-8">
            {/* Mobile menu toggle */}
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white-1a transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
            </button>
            <Link href="/" className="text-xl font-bold">
              <Image
                src="/assets/true_compnion_logo.png"
                alt="Logo"
                width={170}
                height={50}
                className="object-contain w-auto h-8 md:h-auto"
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
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default NavBar;

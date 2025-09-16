import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserDropdown from './UserDropdown';
import Auth from '../auth/Auth';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
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

  const navLinks = [
    { href: '/girls', label: 'Girls' },
    { href: '/guys', label: 'Guys' },
    { href: '/anime', label: 'Anime' },
  ];

  return (
    <>
      <nav
        className={`fixed ${isBannerVisible ? 'top-[40px]' : 'top-0'} right-0 left-16 h-16 bg-background-primary text-text-primary z-40 transition-all duration-300`}
      >
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              True Companion
            </Link>

            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative h-16 flex items-center text-lg
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
            </div>
          </div>

          {/* Right Side - Create AI Character Button and Profile */}
          <div className="flex items-center space-x-6">
            <Link
              href="/create-character"
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-black text-lg font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-colors"
            >
              Create AI Character
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-[46px] h-[46px] rounded-full bg-secondary-700 flex items-center justify-center hover:opacity-90 transition-opacity overflow-hidden"
              >
                {isAuthenticated && user ? (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-accent-cyan to-accent-cyan-dark text-white font-bold text-lg">
                      {(() => {
                        // Safely extract first letter of name
                        const name = user.name as unknown;
                        if (typeof name === 'string' && name.length > 0) {
                          return name.charAt(0).toUpperCase();
                        }
                        return 'U';
                      })()}
                    </div>
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
              </button>
              <UserDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onLoginClick={() => setIsAuthOpen(true)}
              />
            </div>
          </div>
        </div>
      </nav>
      <Auth isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default NavBar;

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaDiscord, FaXTwitter, FaInstagram, FaReddit } from 'react-icons/fa6';
import { IoLanguage } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Footer = () => {
  const pathname = usePathname();
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Routes where bottom navigation should be visible on mobile
  const bottomNavRoutes = ['/', '/girls', '/guys', '/collection', '/my-ai', '/explore', '/chat', '/create-character', '/wallet'];
  const isBottomNavPage = bottomNavRoutes.some(route =>
    route === '/' ? pathname === '/' : pathname.startsWith(route),
  );

  const isActive = (path: string) => {
    return pathname === path || (path !== '/' && pathname.startsWith(path));
  };

  const handleWalletClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 2000);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      {isBottomNavPage && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background-primary border-t border-white-1a z-50 px-2 py-2 pointer-events-auto">
          <div className="flex justify-between items-center max-w-md mx-auto relative pointer-events-auto">{/* Explore */}
            <Link
              href="/explore"
              className={`flex flex-col items-center justify-center w-16 transition-colors pointer-events-auto ${
                isActive('/explore') ? 'text-primary-500' : 'text-text-secondary'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                />
              </svg>
              <span className="text-[10px] mt-1 font-medium">Explore</span>
            </Link>

            {/* Collection */}
            <Link
              href="/collection"
              className={`flex flex-col items-center justify-center w-16 transition-colors pointer-events-auto ${
                isActive('/collection') ? 'text-primary-500' : 'text-text-secondary'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="text-[10px] mt-1 font-medium">Collection</span>
            </Link>

            {/* Create Avatar (Center) */}
            <div className="flex flex-col items-center justify-end w-24 h-12 relative pb-1 pointer-events-auto">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-8 z-50 pointer-events-auto"
              >
                <Link
                  href="/create-character"
                  className="flex flex-col items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 w-14 h-14 rounded-full shadow-[0_0_15px_rgba(59,185,255,0.5)] border-4 border-background-primary transform active:scale-95 transition-transform pointer-events-auto"
                >
                  <Image
                    src="/assets/wand2.svg"
                    alt="Create"
                    width={24}
                    height={24}
                    className="brightness-0 invert"
                  />
                </Link>
                {/* Bubble ripple effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.4],
                    opacity: [0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute inset-0 bg-primary-500 rounded-full -z-10 pointer-events-none"
                />
              </motion.div>
              <span className="text-[12px] font-bold text-primary-500 whitespace-nowrap">
                Create Avatar
              </span>
            </div>

            {/* Chat */}
            <Link
              href="/chat"
              className={`flex flex-col items-center justify-center w-16 transition-colors pointer-events-auto ${
                isActive('/chat') ? 'text-primary-500' : 'text-text-secondary'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-[10px] mt-1 font-medium">Chat</span>
            </Link>

            {/* Wallet */}
            <Link
              href="/wallet"
              className={`flex flex-col items-center justify-center w-16 transition-colors pointer-events-auto ${
                isActive('/wallet') ? 'text-primary-500' : 'text-text-secondary'
              }`}
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <span className="text-[10px] mt-1 font-medium">Wallet</span>
            </Link>
          </div>
        </div>
      )}

      {/* Coming Soon Popup */}
      {showComingSoon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-secondary-700 to-secondary-800 rounded-2xl p-8 shadow-2xl border border-white-1a max-w-sm mx-4"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 1 }}
                className="text-6xl mb-4"
              >
                🚀
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Coming Soon!</h3>
              <p className="text-text-secondary">
                Wallet feature is under development. Stay tuned!
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Standard Footer - Hidden on mobile for bottom nav pages */}
      <footer
        className={`bg-black text-text-secondary sm:px-2 md:px-0 sm:py-6 md:py-4 mt-auto md:ml-16 ${
          isBottomNavPage ? 'hidden md:block' : ''
        }`}
      >
        <div className="max-w-7xl  md:mx-auto sm:px-4 md:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Logo and Description */}
          <div className="md:space-y-2 sm:space-y-6">
            <Link href="/" className="text-text-primary text-xl sm:text-2xl font-bold italic">
              Daily Love
            </Link>
            <div className="flex items-center">
              <IoLanguage className="w-5 h-5 mr-2" />
              <span>English</span>
            </div>
            <p className="text-xs ">
              Daily Love is where imagination meets innovation. Bring your ideas to life with custom
              AI characters, stunning AI-generated art, and meaningful connections. Join us today
              and start creating something extraordinary.
            </p>
            <div className=" text-xs">
              <p>Spyrou Kyprianou 92, FlatOffice 1192</p>
              <p>Potamos Germasogeias, 4042</p>
              <p>Limassol, Cyprus</p>
            </div>
          </div>

          {/* Daily Love Links */}
          <div className="md:space-y-2 sm:space-y-6">
            <h3 className="text-text-primary text-base sm:text-lg">Daily Love</h3>
            <div className="flex space-x-4">
              <Link
                href="https://discord.gg/truecompanion"
                target="_blank"
                className="hover:text-primary-500"
              >
                <FaDiscord className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="https://x.com/truecompanion"
                target="_blank"
                className="hover:text-primary-500"
              >
                <FaXTwitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="https://instagram.com/truecompanion"
                target="_blank"
                className="hover:text-primary-500"
              >
                <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="https://reddit.com/r/truecompanion"
                target="_blank"
                className="hover:text-primary-500"
              >
                <FaReddit className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>

          {/* Help Center */}
          <div className="md:space-y-2 sm:space-y-6">
            <h3 className="text-text-primary text-base sm:text-lg">Help Center</h3>
            <Link
              href="mailto:help@truecompanion.com"
              className="block hover:text-primary-500 text-xs sm:text-sm"
            >
              help@truecompanion.com
            </Link>
          </div>

          {/* Policy Links */}
          <div className="md:space-y-2 sm:space-y-6">
            <h3 className="text-text-primary text-base sm:text-lg">Policy</h3>
            <div className="flex flex-col md:space-y-1 sm:space-y-3">
              <Link href="/privacy-policy" className="hover:text-primary-500 text-xs sm:text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-500 text-xs sm:text-sm">
                Terms & Conditions
              </Link>
              <Link href="/cookies" className="hover:text-primary-500 text-xs sm:text-sm">
                Cookies Policy
              </Link>
              <Link
                href="/content-moderation"
                className="hover:text-primary-500 text-xs sm:text-sm"
              >
                Content Moderation Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto sm:px-4 md:mt-2 sm:mt-4  sm:pt-3 border-t border-gray-800">
          <p className="text-sm">© Daily Love. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;

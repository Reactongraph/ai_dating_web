import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  isMobileView: boolean;
  isMobileOpen: boolean;
}

const Sidebar = ({ isExpanded, onToggle, isMobileView, isMobileOpen }: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-black text-text-primary flex flex-col py-4 z-50 transition-all duration-300 ${
        isMobileView
          ? `${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
          : isExpanded
            ? 'w-64'
            : 'w-16'
      }`}
    >
      {/* Top Section with Toggle */}
      <div
        className={`flex ${isExpanded || isMobileView ? 'justify-between px-4 items-center' : 'justify-center'} mb-6 text-white`}
      >
        {isExpanded && (
          <Link href="/" className="text-xl font-bold">
            <Image
              src="/assets/daily_love.png"
              alt="Logo"
              width={170}
              height={50}
              className="object-contain w-auto h-8 md:h-auto"
            />
          </Link>
        )}
        {isExpanded || isMobileView ? (
          <button onClick={onToggle} className="p-2 hover:bg-background-elevated rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : (
          <button onClick={onToggle} className="p-2 hover:bg-background-elevated rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Main Navigation Items */}
      <div className="flex flex-col space-y-2">
        {/* Explore */}
        <Link
          href="/explore"
          className={`flex items-center ${isActive('/explore') ? 'text-white bg-white-1a' : 'text-text-secondary'} hover:text-white group rounded-xl transition-colors ${
            isExpanded || isMobileView ? 'mx-3 px-3 py-2' : 'mx-2 justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <svg
            className="w-6 h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
            />
          </svg>
          {(isExpanded || isMobileView) && <span className="ml-2 text-sm">Explore</span>}
        </Link>

        {/* Girls - Mobile Only */}
        {isMobileView ||
          (isExpanded && (
            <>
              <Link
                href="/girls"
                className={`flex items-center ${isActive('/girls') ? 'text-white bg-white-1a' : 'text-text-secondary'} hover:text-white group rounded-xl transition-colors mx-3 px-3 py-2 hover:bg-white-1a pl-8`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="ml-2 text-sm">Girls</span>
              </Link>

              <Link
                href="/guys"
                className={`flex items-center ${isActive('/guys') ? 'text-white bg-white-1a' : 'text-text-secondary'} hover:text-white group rounded-xl transition-colors mx-3 px-3 py-2 hover:bg-white-1a pl-8`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="ml-2 text-sm">Guys</span>
              </Link>
            </>
          ))}

        {/* Collection */}
        <Link
          href="/collection"
          className={`flex items-center ${isActive('/collection') ? 'text-white bg-white-1a' : 'text-text-secondary'} hover:text-white group rounded-xl transition-colors ${
            isExpanded || isMobileView ? 'mx-3 px-3 py-2' : 'mx-2 justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <svg
            className="w-6 h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          {(isExpanded || isMobileView) && <span className="ml-2 text-sm">Collection</span>}
        </Link>

        {/* Chat */}
        <Link
          href="/chat"
          className={`flex items-center ${isActive('/chat') ? 'text-white bg-white-1a' : 'text-text-secondary'} hover:text-white group rounded-xl transition-colors ${
            isExpanded || isMobileView ? 'mx-3 px-3 py-2' : 'mx-2 justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <svg
            className="w-6 h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {(isExpanded || isMobileView) && <span className="ml-2 text-sm">Chat</span>}
        </Link>

        {/* My AI */}
        <Link
          href="/my-ai"
          className={`flex items-center ${isActive('/my-ai') ? 'text-white bg-white-1a' : 'text-text-secondary'} hover:text-white group rounded-xl transition-colors ${
            isExpanded || isMobileView ? 'mx-3 px-3 py-2' : 'mx-2 justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <div className="relative flex-shrink-0 w-6 h-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
          </div>
          {(isExpanded || isMobileView) && <span className="ml-2 text-sm">My AI</span>}
        </Link>

        {/* Create AI Character Button */}
        <div
          className={
            isExpanded || isMobileView ? 'px-2 mx-2 mt-2' : 'mx-2 flex justify-center mt-2'
          }
        >
          <Link
            href="/create-character"
            className={`${isActive('/create-character') ? 'opacity-90' : ''} bg-gradient-to-r from-primary-500 to-primary-600 rounded-md flex items-center justify-center text-white hover:opacity-90 transition-opacity ${
              isExpanded || isMobileView ? 'w-full h-10' : 'w-12 h-12'
            }`}
          >
            {isExpanded || isMobileView ? (
              <span className="flex items-center justify-center gap-2 text-sm">
                {' '}
                <Image
                  src="/assets/wand2.svg"
                  alt="Create AI Character"
                  width={24}
                  height={24}
                  className="flex-shrink-0 brightness-0 invert"
                />
                Create AI Character
              </span>
            ) : (
              <Image
                src="/assets/wand3.svg"
                alt="Create AI Character"
                width={22}
                height={22}
                className="flex-shrink-0"
              />
            )}
          </Link>
        </div>
      </div>

      {/* Bottom Section */}
      {/* <div className="mt-auto flex flex-col space-y-2">
        
        <Link
          href="/premium"
          className={`flex items-center ${isActive('/premium') ? 'text-yellow-400 bg-white-1a' : 'text-yellow-500'} hover:text-yellow-400 group rounded-xl transition-colors ${
            isExpanded || isMobileView
              ? 'mx-3 px-3 py-2'
              : 'mx-2 justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <div className="relative flex-shrink-0 w-6 h-6">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          {(isExpanded || isMobileView) && (
            <span className="ml-2 text-sm">
              Premium Now
              <span className="px-2 py-1.5 text-md  text-white bg-gradient-to-r from-accent-cyan to-accent-cyan-dark rounded-full">
                -70%
              </span>
            </span>
          )}
        </Link>

        
        <Link
          href="/privacy-terms"
          className={`flex items-center ${isActive('/privacy-terms') ? 'text-white bg-white-1a' : 'text-text-secondary'} hover:text-white group rounded-xl transition-colors ${
            isExpanded || isMobileView
              ? 'mx-3 px-3 py-2'
              : 'mx-2 justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <svg
            className="w-6 h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {(isExpanded || isMobileView) && (
            <span className="ml-2 text-sm">Privacy & Terms</span>
          )}
        </Link>

        
        <Link
          href="/help"
          className={`flex items-center ${isActive('/help') ? 'text-white bg-white-1a' : 'text-text-secondary'} hover:text-white group rounded-xl transition-colors ${
            isExpanded || isMobileView
              ? 'mx-3 px-3 py-2'
              : 'mx-2 justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <svg
            className="w-6 h-6 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {(isExpanded || isMobileView) && (
            <span className="ml-2 text-sm">Help Center</span>
          )}
        </Link>
      </div> */}
    </aside>
  );
};

export default Sidebar;

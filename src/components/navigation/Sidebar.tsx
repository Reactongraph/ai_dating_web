import Link from 'next/link';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isExpanded, onToggle }: SidebarProps) => {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-black text-text-primary flex flex-col py-4 z-50 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Top Section with Toggle */}
      <div
        className={`flex ${isExpanded ? 'justify-end px-4' : 'justify-center'} mb-6 text-white`}
      >
        {isExpanded ? (
          <button
            onClick={onToggle}
            className="p-2 hover:bg-background-elevated rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="p-2 hover:bg-background-elevated rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
      <div className="flex flex-col space-y-6">
        {/* Explore */}
        <Link
          href="/explore"
          className={`flex items-center text-text-secondary hover:text-white group rounded-xl transition-colors ${
            isExpanded ? 'mx-3 px-3 py-2' : 'justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <svg
            className="w-6 h-6"
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
          {isExpanded && <span className="ml-4">Explore</span>}
        </Link>

        {/* Collection */}
        <Link
          href="/collection"
          className={`flex items-center text-text-secondary hover:text-white group rounded-xl transition-colors ${
            isExpanded ? 'mx-3 px-3 py-2' : 'justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <svg
            className="w-6 h-6"
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
          {isExpanded && <span className="ml-4">Collection</span>}
        </Link>

        {/* Chat */}
        <Link
          href="/chat"
          className={`flex items-center text-text-secondary hover:text-white group rounded-xl transition-colors ${
            isExpanded ? 'mx-3 px-3 py-2' : 'justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <svg
            className="w-6 h-6"
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
          {isExpanded && <span className="ml-4">Chat</span>}
        </Link>

        {/* My AI */}
        <Link
          href="/my-ai"
          className={`flex items-center text-text-secondary hover:text-white group rounded-xl transition-colors ${
            isExpanded ? 'mx-3 px-3 py-2' : 'justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <div className="relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
          </div>
          {isExpanded && <span className="ml-4">My AI</span>}
        </Link>

        {/* Create AI Character Button */}
        <div className={isExpanded ? 'px-3 mx-3' : 'flex justify-center'}>
          <button className="w-full h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-md flex items-center justify-center text-white hover:opacity-90 transition-opacity">
            {isExpanded ? (
              <span>Create AI Character</span>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col space-y-6">
        {/* Premium */}
        <Link
          href="/premium"
          className={`flex items-center text-yellow-500 hover:text-yellow-400 group rounded-xl transition-colors ${
            isExpanded ? 'mx-3 px-3 py-2' : 'justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          {isExpanded && (
            <span className="ml-4">
              Premium Now{' '}
              <span className="px-2 py-1.5 text-md  text-white bg-gradient-to-r from-accent-cyan to-accent-cyan-dark rounded-full">
                -70%
              </span>
            </span>
          )}
        </Link>

        {/* Privacy & Terms */}
        <Link
          href="/privacy-terms"
          className={`flex items-center text-text-secondary hover:text-white group rounded-xl transition-colors ${
            isExpanded ? 'mx-3 px-3 py-2' : 'justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <svg
            className="w-6 h-6"
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
          {isExpanded && <span className="ml-4">Privacy & Terms</span>}
        </Link>

        {/* Help Center */}
        <Link
          href="/help"
          className={`flex items-center text-text-secondary hover:text-white group rounded-xl transition-colors ${
            isExpanded ? 'mx-3 px-3 py-2' : 'justify-center w-12 h-12'
          } hover:bg-white-1a`}
        >
          <svg
            className="w-6 h-6"
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
          {isExpanded && <span className="ml-4">Help Center</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

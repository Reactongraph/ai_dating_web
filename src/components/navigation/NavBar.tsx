import Link from 'next/link';
import Image from 'next/image';

const NavBar = () => {
  return (
    <nav className="fixed top-0 right-0 left-16 h-16 bg-background-primary text-text-primary z-40">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo and Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold">
            True Companion
          </Link>

          <div className="flex space-x-6">
            <Link
              href="/girls"
              className="text-primary-500 border-b-2 border-primary-500 pb-1"
            >
              Girls
            </Link>
            <Link
              href="/guys"
              className="text-text-secondary hover:text-white transition-colors"
            >
              Guys
            </Link>
            <Link
              href="/anime"
              className="text-text-secondary hover:text-white transition-colors"
            >
              Anime
            </Link>
          </div>
        </div>

        {/* Right Side - Create AI Character Button and Profile */}
        <div className="flex items-center space-x-4">
          <button className="bg-gradient-to-r from-[#3BB9FF] to-[#2AA8EE] text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors">
            Create AI Character
          </button>
          <div className="w-8 h-8 rounded-full bg-secondary-700 flex items-center justify-center">
            <Image
              src="/default-avatar.png"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

import Link from 'next/link';
import { FaDiscord, FaXTwitter, FaInstagram, FaReddit } from 'react-icons/fa6';
import { IoLanguage } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="bg-black text-text-secondary sm:px-2 md:px-0  sm:py-6 md:py-4 mt-auto md:ml-16">
      <div className="max-w-7xl  md:mx-auto sm:px-4 md:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Logo and Description */}
        <div className="md:space-y-2 sm:space-y-6">
          <Link href="/" className="text-text-primary text-xl sm:text-2xl font-bold italic">
            True Companion
          </Link>
          <div className="flex items-center">
            <IoLanguage className="w-5 h-5 mr-2" />
            <span>English</span>
          </div>
          <p className="text-xs ">
            True Companion is where imagination meets innovation. Bring your ideas to life with
            custom AI characters, stunning AI-generated art, and meaningful connections. Join us
            today and start creating something extraordinary.
          </p>
          <div className=" text-xs">
            <p>Spyrou Kyprianou 92, FlatOffice 1192</p>
            <p>Potamos Germasogeias, 4042</p>
            <p>Limassol, Cyprus</p>
          </div>
        </div>

        {/* True Companion Links */}
        <div className="md:space-y-2 sm:space-y-6">
          <h3 className="text-text-primary text-base sm:text-lg">True Companion</h3>
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
            <Link href="/content-moderation" className="hover:text-primary-500 text-xs sm:text-sm">
              Content Moderation Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto sm:px-4 md:mt-2 sm:mt-4  sm:pt-3 border-t border-gray-800">
        <p className="text-sm">© True Companion. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

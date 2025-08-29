import Link from 'next/link';
import { FaDiscord, FaXTwitter, FaInstagram, FaReddit } from 'react-icons/fa6';
import { IoLanguage } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="bg-black text-text-secondary py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="space-y-6">
          <Link
            href="/"
            className="text-text-primary text-2xl font-bold italic"
          >
            True Companion
          </Link>
          <div className="flex items-center">
            <IoLanguage className="w-5 h-5 mr-2" />
            <span>English</span>
          </div>
          <p className="text-sm">
            True Companion is where imagination meets innovation. Bring your
            ideas to life with custom AI characters, stunning AI-generated art,
            and meaningful connections. Join us today and start creating
            something extraordinary.
          </p>
          <div className="text-sm">
            <p>Spyrou Kyprianou 92, FlatOffice 1192</p>
            <p>Potamos Germasogeias, 4042</p>
            <p>Limassol, Cyprus</p>
          </div>
        </div>

        {/* True Companion Links */}
        <div className="space-y-6">
          <h3 className="text-text-primary text-lg">True Companion</h3>
          <div className="flex space-x-4">
            <Link
              href="https://discord.gg/truecompanion"
              target="_blank"
              className="hover:text-primary-500"
            >
              <FaDiscord className="w-6 h-6" />
            </Link>
            <Link
              href="https://x.com/truecompanion"
              target="_blank"
              className="hover:text-primary-500"
            >
              <FaXTwitter className="w-6 h-6" />
            </Link>
            <Link
              href="https://instagram.com/truecompanion"
              target="_blank"
              className="hover:text-primary-500"
            >
              <FaInstagram className="w-6 h-6" />
            </Link>
            <Link
              href="https://reddit.com/r/truecompanion"
              target="_blank"
              className="hover:text-primary-500"
            >
              <FaReddit className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Help Center */}
        <div className="space-y-6">
          <h3 className="text-text-primary text-lg">Help Center</h3>
          <Link
            href="mailto:help@truecompanion.com"
            className="block hover:text-primary-500"
          >
            help@truecompanion.com
          </Link>
        </div>

        {/* Policy Links */}
        <div className="space-y-6">
          <h3 className="text-text-primary text-lg">Policy</h3>
          <div className="flex flex-col space-y-3">
            <Link href="/privacy-policy" className="hover:text-primary-500">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-500">
              Terms & Conditions
            </Link>
            <Link href="/cookies" className="hover:text-primary-500">
              Cookies Policy
            </Link>
            <Link href="/content-moderation" className="hover:text-primary-500">
              Content Moderation Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800">
        <p className="text-sm">© True Companion. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

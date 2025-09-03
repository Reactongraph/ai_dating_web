import Link from 'next/link';

interface AdBannerProps {
  text: string;
  discount: string;
  buttonText: string;
  buttonHref: string;
}

const AdBanner = ({
  text,
  discount,
  buttonText,
  buttonHref,
}: AdBannerProps) => {
  return (
    <div
      className="relative w-full py-4 px-6 bg-cover bg-center"
      style={{ backgroundImage: 'url("/assets/advBanner.png")' }}
    >
      {/* Sparkle overlay */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: 'url("/assets/sparkle.png")' }}
      /> */}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-white">{text}</h2>
          <span className="text-4xl font-bold text-accent-yellow">
            {discount}
          </span>
        </div>
        <Link
          href={buttonHref}
          className="bg-primary-500 hover:opacity-90 transition-opacity text-white px-6 py-2 rounded-full text-lg font-medium"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default AdBanner;

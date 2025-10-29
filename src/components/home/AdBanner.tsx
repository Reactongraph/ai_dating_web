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
      className="relative w-full py-2 md:py-4 px-3 md:px-6 bg-cover bg-center"
      style={{ backgroundImage: 'url("/assets/advBanner.png")' }}
    >
      {/* Sparkle overlay */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: 'url("/assets/sparkle.png")' }}
      /> */}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">
            {text}
          </h2>
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-accent-yellow">
            {discount}
          </span>
        </div>
        <Link
          href={buttonHref}
          className="bg-primary-500 hover:opacity-90 transition-opacity text-white px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base md:text-lg font-medium w-full sm:w-auto text-center"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default AdBanner;

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
    <div className="relative w-full bg-gradient-to-r from-[#0066FF] via-[#7000FF] to-[#FF1493] py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-white">{text}</h2>
          <span className="text-4xl font-bold text-[#FFD700]">{discount}</span>
        </div>
        <Link
          href={buttonHref}
          className="bg-[#3BB9FF] hover:opacity-90 transition-opacity text-white px-6 py-2 rounded-full text-lg font-medium"
        >
          {buttonText}
        </Link>
      </div>
      {/* Decorative stars */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-2 right-4 w-2 h-2 bg-white opacity-50 rounded-full" />
        <div className="absolute top-6 right-12 w-1 h-1 bg-white opacity-30 rounded-full" />
        <div className="absolute top-1 right-24 w-1.5 h-1.5 bg-white opacity-40 rounded-full" />
      </div>
    </div>
  );
};

export default AdBanner;

import Image from 'next/image';
import Link from 'next/link';
import { FaWandMagicSparkles } from 'react-icons/fa6';

interface HeroSectionProps {
  title: {
    main: string;
    highlight: {
      text: string;
      color: string;
    };
    rest?: string;
  };
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  imageSrc: string;
}

const HeroSection = ({
  title,
  subtitle,
  buttonText,
  buttonHref,
  imageSrc,
}: HeroSectionProps) => {
  return (
    <div className="relative w-full bg-black min-h-[600px] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[#4B0082] to-[#FF69B4] opacity-50" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center">
        {/* Text Content */}
        <div className="flex-1 space-y-6 z-10">
          <h1 className="text-5xl font-bold text-white space-y-2">
            <span className="block">{title.main}</span>
            <span className="block">
              <span className={`text-[${title.highlight.color}]`}>
                {title.highlight.text}
              </span>
              {title.rest}
            </span>
          </h1>
          <p className="text-xl text-gray-300">{subtitle}</p>
          <Link
            href={buttonHref}
            className="inline-flex bg-gradient-to-r from-[#3BB9FF] to-[#2AA8EE] text-white px-8 py-3 rounded-lg text-lg font-medium items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            <FaWandMagicSparkles className="w-5 h-5" />
            <span>{buttonText}</span>
          </Link>
        </div>

        {/* Image */}
        <div className="flex-1 mt-10 lg:mt-0">
          <div className="relative w-full h-[400px]">
            <Image
              src={imageSrc}
              alt="AI Characters"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-white opacity-50 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white opacity-30 rounded-full" />
        <div className="absolute top-1/2 right-1/5 w-1.5 h-1.5 bg-white opacity-40 rounded-full" />
      </div>
    </div>
  );
};

export default HeroSection;

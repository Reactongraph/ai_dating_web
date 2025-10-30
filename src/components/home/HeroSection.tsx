import Image from 'next/image';
import Link from 'next/link';
import { FaWandMagicSparkles } from 'react-icons/fa6';

interface HeroSectionProps {
  title: {
    main: string;
    highlight: {
      text: string;
      color:
        | 'text-primary-500'
        | 'text-primary-600'
        | 'text-white'
        | 'text-gray-300';
    };
    rest?: string;
  };
  subtitle: string;
  buttonText: string;
  imageSrc: string;
}

const HeroSection = ({
  title,
  subtitle,
  buttonText,
  imageSrc,
}: HeroSectionProps) => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0  bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/banner.png")' }}
      />

      {/* Content */}
      <div className="relative mx-auto px-4 sm:px-6 md:px-8  md:py-0 flex flex-col lg:flex-row items-center">
        {/* Text Content */}
        <div className="flex-1 lg:ml-10 space-y-5 z-10 text-center lg:text-left">
          <h1 className="md:text-5xl sm:text-xl font-bold text-white">
            <span className="block">{title.main}</span>
            <span className="block">
              <span className={title.highlight.color}>
                {title.highlight.text}
              </span>
              {title.rest}
            </span>
          </h1>
          <p className="sm:text-xs md:text-sm text-gray-300">{subtitle}</p>
          <Link
            href="/create-character"
            className="inline-flex bg-gradient-to-r from-primary-500 to-primary-600 text-white px-2 sm:py-0 md:py-1  rounded-lg text-xs sm:text-base  font-medium items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            <FaWandMagicSparkles className="w-4 h-4" />
            <span>{buttonText}</span>
          </Link>
        </div>

        {/* Image - Only visible on large screens */}
        <div className="hidden lg:block flex-1 mt-0">
          <div className="relative w-full h-[350px]">
            <Image
              src={imageSrc}
              alt="AI Characters"
              fill
              className="absolute object-contain bottom-0 !top-[inherit] max-h-[100%] !h-[auto]"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

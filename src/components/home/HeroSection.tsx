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
    <div className="relative w-full min-h-[400px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0  bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/banner.png")' }}
      />

      {/* Content */}
      <div className="relative  mx-auto  flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <div className="flex-1 md:ml-10 space-y-6 z-10">
          <h1 className="text-5xl font-bold text-white space-y-2">
            <span className="block">{title.main}</span>
            <span className="block">
              <span className={title.highlight.color}>
                {title.highlight.text}
              </span>
              {title.rest}
            </span>
          </h1>
          <p className="text-xl text-gray-300">{subtitle}</p>
          <Link
            href="/create-character"
            className="inline-flex bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium items-center space-x-2 hover:opacity-90 transition-opacity"
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
    </div>
  );
};

export default HeroSection;

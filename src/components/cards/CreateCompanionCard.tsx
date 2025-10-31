import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface CreateCompanionCardProps {
  href?: string;
  onClick?: () => void;
  buttonText?: string;
  title?: string;
  backgroundImage?: string;
}

const CreateCompanionCard = ({
  href,
  onClick,
  buttonText = 'Create AI Character',
  title = 'Create your own AI Girlfriend',
  backgroundImage = '/assets/cardgirl1.png',
}: CreateCompanionCardProps) => {
  const CustomBtn = memo(() => (
    <span className="sm:text-xs md:text-xs lg:text-sm flex gap-1 items-center">
      <Image
        src="/assets/wand2.svg"
        alt="Create AI Character"
        width={24}
        height={24}
        className="brightness-0 invert sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
      />
      <>{buttonText}</>
    </span>
  ));
  CustomBtn.displayName = 'CustomBtn';

  const buttonClasses =
    'inline-flex bg-gradient-to-r from-primary-500 to-primary-600 text-white sm:px-1 lg:px-2 sm:py-1 lg:py-2 rounded-xl font-medium items-center space-x-2';

  const renderButton = () => {
    if (href) {
      return (
        <Link href={href} className={buttonClasses}>
          <CustomBtn />
        </Link>
      );
    }

    if (onClick) {
      return (
        <button onClick={onClick} className={buttonClasses}>
          <CustomBtn />
        </button>
      );
    }

    return (
      <Link href="/create-character" className={buttonClasses}>
        <CustomBtn />
      </Link>
    );
  };

  return (
    <div
      className="relative h-[350px] sm:h-[300px] lg:h-[350px] w-full rounded-2xl overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center bg-black/30">
        <h3 className="sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-6">
          {title}
        </h3>
        {renderButton()}
      </div>
    </div>
  );
};

export default CreateCompanionCard;

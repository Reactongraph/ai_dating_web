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
    <span className="text-[10px] sm:text-xs md:text-[10px] lg:text-sm xl:text-base 2xl:text-base flex gap-1 items-center">
      <Image
        src="/assets/wand2.svg"
        alt="Create AI Character"
        width={24}
        height={24}
        className="brightness-0 invert w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-3.5 md:h-3.5 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7"
      />
      <span>{buttonText}</span>
    </span>
  ));
  CustomBtn.displayName = 'CustomBtn';

  const buttonClasses =
    'inline-flex bg-gradient-to-r from-primary-500 to-primary-600 text-white px-2.5 py-2 sm:px-3 sm:py-1.5 md:px-2 lg:px-4 lg:py-2.5 xl:px-6 xl:py-3 rounded-full font-bold items-center justify-center whitespace-nowrap shadow-lg hover:opacity-90 transition-opacity';

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
      className="relative h-[350px] sm:h-[300px] lg:h-[380px] xl:h-[400px] 2xl:h-[420px] flex-[1_1_calc(50%-4px)] sm:flex-[1_1_calc(50%-10px)] md:flex-[1_1_calc(50%-8px)] lg:flex-[1_1_280px] xl:flex-[1_1_300px] 2xl:flex-[1_1_320px] min-w-[150px] max-w-[400px] rounded-2xl overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-5 lg:p-6 xl:p-8 text-center bg-black/40">
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-8">
          {title}
        </h3>
        <div className="w-full flex justify-center pb-2">
          {renderButton()}
        </div>
      </div>
    </div>
  );
};

export default CreateCompanionCard;

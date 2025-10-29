import Image from 'next/image';

interface StepCardProps {
  iconSrc: string;
  title: string;
  description: string;
}

const StepCard = ({ iconSrc, title, description }: StepCardProps) => (
  <div className="relative">
    {/* Main Card */}
    <div className="relative bg-background-card rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-6 sm:p-8 md:p-12 flex flex-col items-center text-center shadow-[2px_2px_0px_#232223] sm:shadow-[3px_3px_0px_#232223] md:shadow-[4px_4px_0px_#232223] h-[100%]">
      {/* Icon Container */}
      <div className="relative w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[72px] md:h-[72px] mb-4 sm:mb-6 md:mb-8">
        <Image
          src={iconSrc}
          alt={title}
          fill
          className="object-contain brightness-0 invert opacity-90"
        />
      </div>

      {/* Title */}
      <h3 className="text-text-primary text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-muted text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const HowToCreate = () => {
  const steps = [
    {
      iconSrc: '/assets/signUp.svg',
      title: 'Sign Up',
      description:
        'Join the True Companion community with a quick and easy registration.',
    },
    {
      iconSrc: '/assets/wand.svg',
      title: 'Bring AI',
      description:
        'Use our powerful AI tools to create your first personalized AI character.',
    },
    {
      iconSrc: '/assets/chat.svg',
      title: 'Conversation',
      description:
        'When she comes to life, enjoy deep and playful chats with your dream AI Girlfriend.',
    },
  ];

  return (
    <section className="relative py-10 sm:py-14 md:py-20 px-4 overflow-hidden">
      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-[42px] font-bold text-center mb-8 sm:mb-12 md:mb-20">
          How to{' '}
          <span className="text-primary-500">create your perfect AI</span>{' '}
          Girlfriend?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-6 md:gap-8">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              iconSrc={step.iconSrc}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToCreate;

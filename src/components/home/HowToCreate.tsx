import Image from 'next/image';

interface StepCardProps {
  iconSrc: string;
  title: string;
  description: string;
}

const StepCard = ({ iconSrc, title, description }: StepCardProps) => (
  <div className="relative">
    {/* Shadow/Border Effect - positioned behind the main card */}
    <div className="absolute -right-1 -bottom-1 w-full h-full bg-background-cardShadow rounded-[24px]" />

    {/* Main Card */}
    <div className="relative bg-background-card rounded-[24px] p-12 flex flex-col items-center text-center">
      {/* Icon Container */}
      <div className="relative w-[72px] h-[72px] mb-8">
        <Image
          src={iconSrc}
          alt={title}
          fill
          className="object-contain brightness-0 invert opacity-90"
        />
      </div>

      {/* Title */}
      <h3 className="text-text-primary text-2xl font-semibold mb-4">{title}</h3>

      {/* Description */}
      <p className="text-text-muted text-base leading-relaxed">{description}</p>
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
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[42px] font-bold text-center mb-20">
          How to{' '}
          <span className="text-primary-500">create your perfect AI</span>{' '}
          Girlfriend?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

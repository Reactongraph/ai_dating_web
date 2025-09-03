import AdBanner from '@/components/home/AdBanner';
import HeroSection from '@/components/home/HeroSection';
import AICompanionsSection from '@/components/home/AICompanionsSection';
import HowToCreate from '@/components/home/HowToCreate';
import ExperienceAndFAQ from '@/components/home/ExperienceAndFAQ';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Ad Banner */}
      <AdBanner
        text="Exclusive Discount on Premium New Users"
        discount="-70%"
        buttonText="Get Premium"
        buttonHref="/premium"
      />

      {/* Hero Section */}
      <HeroSection
        title={{
          main: 'Create your Perfect',
          highlight: {
            text: 'AI',
            color: 'text-primary-500',
          },
          rest: ' girlfriend',
        }}
        subtitle="From chats to charm — design the AI girlfriend of your dreams."
        buttonText="Create AI Character"
        buttonHref="/create-character"
        imageSrc="/assets/girlBanner.png"
      />

      {/* AI Companions Section */}
      <AICompanionsSection />

      {/* How To Create Section */}
      <HowToCreate />

      {/* Experience and FAQ Section */}
      <ExperienceAndFAQ />
    </div>
  );
}

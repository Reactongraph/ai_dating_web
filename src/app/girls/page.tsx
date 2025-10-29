'use client';

import { useGetBotProfilesQuery } from '@/redux/services/botProfilesApi';
import CompanionCard from '@/components/cards/CompanionCard';
import CreateCompanionCard from '@/components/cards/CreateCompanionCard';
import CompanionsLayout from '@/components/layouts/CompanionsLayout';
import { mapBotProfilesToCompanions } from '@/utils/mappers';
import { useChatInitiation } from '@/hooks/useChatInitiation';

export default function GirlsPage() {
  const {
    data: botProfiles,
    isLoading,
    error,
  } = useGetBotProfilesQuery('girl');

  const { startChat } = useChatInitiation();

  // Handle companion card click
  const handleCompanionClick = (companion: { id: string }) => {
    startChat(companion.id);
  };

  return (
    <CompanionsLayout
      title="Discover AI Girlfriends"
      subtitle="From friendly to flirty - dive into a world of personalities crafted just for you."
    >
      {/* Create Companion Card */}
      <CreateCompanionCard
        title="Create your own AI Girlfriend"
        buttonText="Create AI Character"
        href="/create-character?type=girl"
        backgroundImage="/assets/cardgirl1.png"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="col-span-3 flex justify-center items-center h-[300px] sm:h-[380px] md:h-[480px]">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="col-span-3 flex justify-center items-center h-[300px] sm:h-[380px] md:h-[480px]">
          <p className="text-red-500 text-sm sm:text-base md:text-lg text-center px-4">
            Failed to load companions. Please try again later.
          </p>
        </div>
      )}

      {/* Companion Cards */}
      {!isLoading &&
        !error &&
        botProfiles?.botProfiles &&
        mapBotProfilesToCompanions(botProfiles.botProfiles).map((companion) => (
          <CompanionCard
            key={companion.id}
            companion={companion}
            onClick={handleCompanionClick}
          />
        ))}
    </CompanionsLayout>
  );
}

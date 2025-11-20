'use client';

import CompanionCard from '@/components/cards/CompanionCard';
import CreateCompanionCard from '@/components/cards/CreateCompanionCard';
import CompanionsLayout from '@/components/layouts/CompanionsLayout';
import { useChatInitiation } from '@/hooks/useChatInitiation';
import { useBotProfilesWithLikes } from '@/hooks/useBotProfilesWithLikes';

export default function GuysPage() {
  const { companions, isLoading, error } = useBotProfilesWithLikes('boy');
  const { startChat } = useChatInitiation();

  // Handle companion card click
  const handleCompanionClick = (companion: { id: string }) => {
    startChat(companion.id);
  };

  return (
    <CompanionsLayout
      title="Discover AI Boyfriends"
      subtitle="From friendly to flirty - dive into a world of personalities crafted just for you."
    >
      {/* Create Companion Card */}
      <CreateCompanionCard
        title="Create your own AI Boyfriend"
        buttonText="Create AI Character"
        href="/create-character?type=guy"
        backgroundImage="/assets/boy.png"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="w-full flex justify-center items-center h-[480px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="w-full flex justify-center items-center h-[480px]">
          <p className="text-red-500">Failed to load companions. Please try again later.</p>
        </div>
      )}

      {/* Companion Cards */}
      {!isLoading &&
        !error &&
        companions.map(companion => (
          <CompanionCard
            key={companion.id}
            companion={companion}
            handleCardClick={handleCompanionClick}
          />
        ))}
    </CompanionsLayout>
  );
}

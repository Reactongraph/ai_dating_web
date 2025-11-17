'use client';

import { useMemo } from 'react';
import {
  useGetBotProfilesQuery,
  useGetLikedBotsQuery,
} from '@/redux/services/botProfilesApi';
import CompanionCard from '@/components/cards/CompanionCard';
import CreateCompanionCard from '@/components/cards/CreateCompanionCard';
import CompanionsLayout from '@/components/layouts/CompanionsLayout';
import { mapBotProfilesToCompanions } from '@/utils/mappers';
import { useChatInitiation } from '@/hooks/useChatInitiation';
import { useAppSelector } from '@/redux/hooks';

export default function GuysPage() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const { data: botProfiles, isLoading, error } = useGetBotProfilesQuery('boy');
  const { startChat } = useChatInitiation();

  // Fetch liked bots if user is authenticated
  const { data: likedBotsResponse } = useGetLikedBotsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Get liked bot IDs
  const likedBotIds = useMemo(() => {
    return likedBotsResponse?.likedBots?.map(bot => bot._id) || [];
  }, [likedBotsResponse]);

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
        <div className="col-span-3 flex justify-center items-center h-[480px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="col-span-3 flex justify-center items-center h-[480px]">
          <p className="text-red-500">Failed to load companions. Please try again later.</p>
        </div>
      )}

      {/* Companion Cards */}
      {!isLoading &&
        !error &&
        botProfiles?.botProfiles &&
        mapBotProfilesToCompanions(botProfiles.botProfiles, likedBotIds).map(companion => (
          <CompanionCard
            key={companion.id}
            companion={companion}
            handleCardClick={handleCompanionClick}
          />
        ))}
    </CompanionsLayout>
  );
}

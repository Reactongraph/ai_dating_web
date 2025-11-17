'use client';

import { useState, useMemo } from 'react';
import CompanionCard from '@/components/cards/CompanionCard';
import CreateCompanionCard from '@/components/cards/CreateCompanionCard';
import CategoryTabs from '@/components/navigation/CategoryTabs';
import { useGetBotProfilesQuery, useGetLikedBotsQuery } from '@/redux/services/botProfilesApi';
import { mapBotProfilesToCompanions } from '@/utils/mappers';
import { useChatInitiation } from '@/hooks/useChatInitiation';
import { useAppSelector } from '@/redux/hooks';

const companionCategories = [
  {
    id: 'girls',
    label: 'Girls',
    botType: 'girl' as const,
  },
  {
    id: 'guys',
    label: 'Guys',
    botType: 'boy' as const,
  },
];

const AICompanionsSection = () => {
  const [activeCategory, setActiveCategory] = useState('girls');
  const { startChat } = useChatInitiation();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  // Get the current bot type based on active category
  const currentBotType =
    companionCategories.find(cat => cat.id === activeCategory)?.botType || 'girl';

  // Fetch bot profiles for the current category
  const { data: botProfilesResponse, isLoading, error } = useGetBotProfilesQuery(currentBotType);

  // Fetch liked bots if user is authenticated
  const { data: likedBotsResponse } = useGetLikedBotsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const tabs = companionCategories.map(cat => ({
    id: cat.id,
    label: cat.label,
  }));

  // Get liked bot IDs
  const likedBotIds = useMemo(() => {
    return likedBotsResponse?.likedBots?.map(bot => bot._id) || [];
  }, [likedBotsResponse]);

  // Transform API data to companion format with liked status
  const companions = botProfilesResponse?.botProfiles
    ? mapBotProfilesToCompanions(botProfilesResponse.botProfiles, likedBotIds)
    : [];

  // Handle companion card click
  const handleCompanionClick = (companion: { id: string }) => {
    startChat(companion.id);
  };

  return (
    <section>
      {/* Banner Title */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: 'url("/assets/meetai.png")' }}
      >
        <div className="max-w-7xl mx-auto px-4  sm:py-2 text-center">
          <h2 className="text-xl sm:text-xl md:text-2xl font-bold text-white">
            Meet Your AI Companions
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-black mt-2 sm:mt-0 px-2 sm:px-2">
        <div className="max-w-7xl mx-auto sm:py-10 md:py-6">
          <p className="text-gray-400 md:text-lg sm:text-xs text-center  sm:mb-8 md:mb-3">
            From friendly to flirty — dive into a world of personalities crafted just for you.
          </p>

          {/* Tabs Navigation */}
          <div className="flex justify-center mb-8 sm:mb-8 md:mb-8">
            <CategoryTabs tabs={tabs} activeTab={activeCategory} onTabChange={setActiveCategory} />
          </div>

          {/* Grid */}
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 lg:grid-cols-4 sm:gap-5 md:gap-2 px-2 sm:px-2">
            <CreateCompanionCard
              backgroundImage={
                activeCategory === 'girls' ? '/assets/cardgirl1.png' : '/assets/boy.png'
              }
            />

            {/* Loading State */}
            {isLoading && (
              <>
                {[...Array(3)].map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="bg-gray-800 rounded-lg p-4 animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                ))}
              </>
            )}

            {/* Error State */}
            {error && (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="text-center">
                  <p className="text-red-400 text-sm sm:text-base md:text-lg mb-4">
                    Failed to load companions. Please try again later.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
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

            {/* Empty State */}
            {!isLoading && !error && companions.length === 0 && (
              <div className="col-span-full flex justify-center items-center py-12">
                <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                  No companions available for this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICompanionsSection;

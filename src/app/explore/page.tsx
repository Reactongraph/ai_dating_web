'use client';

import { useState } from 'react';
import CategoryTabs from '@/components/navigation/CategoryTabs';
import CompanionCard from '@/components/cards/CompanionCard';
import CreateCompanionCard from '@/components/cards/CreateCompanionCard';
import { useChatInitiation } from '@/hooks/useChatInitiation';
import { useBotProfilesWithLikes } from '@/hooks/useBotProfilesWithLikes';

const tabs = [
  { id: 'girl', label: 'Girls' },
  { id: 'boy', label: 'Guys' },
  //   { id: 'anime', label: 'Anime' },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'girl' | 'boy'>('girl');
  const { companions, isLoading, error } = useBotProfilesWithLikes(activeTab);
  const { startChat } = useChatInitiation();

  // Handle companion card click
  const handleCompanionClick = (companion: { id: string }) => {
    startChat(companion.id);
  };

  const handleTabChange = (tabId: string) => {
    // Type guard to ensure tabId is a valid bot type
    if (tabId === 'girl' || tabId === 'boy') {
      setActiveTab(tabId);
    }
  };

  const getCreateCompanionProps = () => {
    switch (activeTab) {
      case 'boy':
        return {
          title: 'Create your own AI Boyfriend',
          buttonText: 'Create AI Character',
          href: '/create-character?type=guy',
          backgroundImage: '/assets/boy.png',
        };
      //   case 'anime':
      //     return {
      //       title: 'Create your own Anime Character',
      //       buttonText: 'Create AI Character',
      //       href: '/create-character?type=anime',
      //       backgroundImage: '/assets/cardanime1.png',
      //     };
      default:
        return {
          title: 'Create your own AI Girlfriend',
          buttonText: 'Create AI Character',
          href: '/create-character?type=girl',
          backgroundImage: '/assets/cardgirl1.png',
        };
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="w-full mx-auto px-3 sm:px-4  sm:py-8 md:pt-12">
        {/* Category Tabs */}
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 md:mb-12">
          <div className="max-w-7xl mx-auto  sm:px-3 text-center">
            <h1 className=" sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
              Discover AI Companions
            </h1>
          </div>
          <CategoryTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Flex Layout */}
        <div className="flex flex-wrap gap-2 sm:gap-5 md:gap-2 lg:gap-3">
          {/* Create Companion Card */}
          <CreateCompanionCard {...getCreateCompanionProps()} />

          {/* Loading State */}
          {isLoading && (
            <div className="w-full flex justify-center items-center h-[300px] sm:h-[380px] md:h-[480px]">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="w-full flex justify-center items-center h-[300px] sm:h-[380px] md:h-[480px]">
              <p className="text-red-500 text-sm sm:text-base md:text-lg text-center px-4">
                Failed to load companions. Please try again later.
              </p>
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
        </div>
      </div>
    </main>
  );
}

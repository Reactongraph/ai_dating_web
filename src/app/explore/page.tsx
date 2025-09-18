'use client';

import { useState } from 'react';
import CategoryTabs from '@/components/navigation/CategoryTabs';
import CompanionCard from '@/components/cards/CompanionCard';
import CreateCompanionCard from '@/components/cards/CreateCompanionCard';
import {
  useGetBotProfilesQuery,
  BotProfile as ApiBotProfile,
} from '@/redux/services/botProfilesApi';
import { Companion } from '@/components/cards/CompanionCard';

const mapBotProfilesToCompanions = (profiles: ApiBotProfile[]): Companion[] => {
  return profiles.map((profile) => ({
    id: profile._id,
    name: profile.name,
    age: parseInt(profile.age) || 20,
    description: profile.bio || 'No description available',
    imageSrc:
      profile.imageURL ||
      profile.avatar_image?.s3Location ||
      '/assets/default-avatar.png',
    tags: [
      profile.occupation,
      profile.personality,
      ...profile.hobbies.slice(0, 1),
    ],
  }));
};

const tabs = [
  { id: 'girl', label: 'Girls' },
  { id: 'boy', label: 'Guys' },
  { id: 'anime', label: 'Anime' },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('girl');
  const {
    data: botProfiles,
    isLoading,
    error,
  } = useGetBotProfilesQuery(activeTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const getCreateCompanionProps = () => {
    switch (activeTab) {
      case 'boy':
        return {
          title: 'Create your own AI Boyfriend',
          buttonText: 'Create AI Character',
          href: '/create-character?type=guy',
          backgroundImage: '/assets/cardboy1.png',
        };
      case 'anime':
        return {
          title: 'Create your own Anime Character',
          buttonText: 'Create AI Character',
          href: '/create-character?type=anime',
          backgroundImage: '/assets/cardanime1.png',
        };
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Discover AI Companions
            </h1>
          </div>
          <CategoryTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Create Companion Card */}
          <CreateCompanionCard {...getCreateCompanionProps()} />

          {/* Loading State */}
          {isLoading && (
            <div className="col-span-3 flex justify-center items-center h-[480px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="col-span-3 flex justify-center items-center h-[480px]">
              <p className="text-red-500">
                Failed to load companions. Please try again later.
              </p>
            </div>
          )}

          {/* Companion Cards */}
          {!isLoading &&
            !error &&
            botProfiles?.botProfiles &&
            mapBotProfilesToCompanions(botProfiles.botProfiles).map(
              (companion) => (
                <CompanionCard key={companion.id} companion={companion} />
              )
            )}
        </div>
      </div>
    </main>
  );
}

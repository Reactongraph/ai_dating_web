'use client';

import { useState, useMemo } from 'react';
import CreateCompanionCard from '@/components/cards/CreateCompanionCard';
import EnhancedCompanionCard, { Companion } from '@/components/cards/EnhancedCompanionCard';
import Image from 'next/image';
import { useGetUserBotProfilesQuery, useGetLikedBotsQuery } from '@/redux/services/botProfilesApi';
import { mapBotProfilesToEnhancedCompanions } from '@/utils/mappers';
import { useAppSelector } from '@/redux/hooks';
import LoginModal from '@/components/auth/LoginModal';
import SignupModal from '@/components/auth/SignupModal';
import { useChatInitiation } from '@/hooks/useChatInitiation';

export default function MyAIPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const { startChat } = useChatInitiation();

  const {
    data: botProfilesResponse,
    isLoading,
    error,
  } = useGetUserBotProfilesQuery(undefined, {
    skip: !isAuthenticated, // Skip the query if user is not authenticated
  });

  // Fetch liked bots if user is authenticated
  const { data: likedBotsResponse } = useGetLikedBotsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Get liked bot IDs
  const likedBotIds = useMemo(() => {
    return likedBotsResponse?.likedBots || [];
  }, [likedBotsResponse]);

  const companions: Companion[] = botProfilesResponse?.botProfiles
    ? mapBotProfilesToEnhancedCompanions(botProfilesResponse.botProfiles, likedBotIds)
    : [];

  const handleIconClick = (companionId: string) => {
    startChat(companionId);
  };

  const handleCardClick = (companionId: string) => {
    startChat(companionId);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="sm:text-xl md:text-2xl font-bold text-white mb-4">My AI</h1>
          <p className="text-gray-400 text-lg">
            Your characters come to life here — created by you, ready to chat anytime.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create AI Character Card */}
          <CreateCompanionCard
            href="/create-character"
            buttonText="Create AI Character"
            title="Create your own AI Girlfriend"
          />

          {/* Not Authenticated State */}
          {!isAuthenticated && (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-center">
                <div className="text-gray-400 text-lg mb-4">
                  You need to login to view your AI companions
                </div>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Login
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAuthenticated && isLoading && (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-white text-lg">Loading your AI companions...</div>
            </div>
          )}

          {/* Error State */}
          {isAuthenticated && error && (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-red-400 text-lg">
                Failed to load your AI companions. Please try again later.
              </div>
            </div>
          )}

          {/* Empty State */}
          {isAuthenticated && !isLoading && !error && companions.length === 0 && (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-gray-400 text-lg text-center">
                <p>You haven&apos;t created any AI companions yet.</p>
                <p className="mt-2">Click &quot;Create AI Character&quot; to get started!</p>
              </div>
            </div>
          )}

          {/* Existing AI Companions */}
          {isAuthenticated &&
            !isLoading &&
            !error &&
            companions.map(companion => (
              <EnhancedCompanionCard
                key={companion.id}
                companion={companion}
                topRightIcon={
                  <Image src="/assets/ping_chat_icon.svg" alt="Chat" width={26} height={26} />
                }
                onIconClick={() => handleIconClick(companion.id)}
                onCardClick={() => handleCardClick(companion.id)}
              />
            ))}
        </div>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onLoginClick={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
}

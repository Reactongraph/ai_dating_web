'use client';

import CollectionCard from '@/components/collection/CollectionCard';
import { useGetLikedBotsQuery } from '@/redux/services/botProfilesApi';
import { mapBotProfilesToCollectionCharacters } from '@/utils/mappers';
import { useAppSelector } from '@/redux/hooks';

export default function CollectionPage() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const {
    data: likedBotsResponse,
    isLoading,
    error,
  } = useGetLikedBotsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Map API response to collection characters
  const characters = likedBotsResponse?.botProfiles
    ? mapBotProfilesToCollectionCharacters(likedBotsResponse.botProfiles)
    : [];

  return (
    <div className="md:pt-12 bg-black">
      {/* Header */}
      <div className="py-2">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="sm:text-xl md:text-2xl font-bold text-white mb-2">My Collection</h1>
          <p className="text-gray-400 sm:text-base md:text-lg">
            All your AI-generated images, saved in one place for easy access.
          </p>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-[480px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center h-[480px]">
            <p className="text-red-500 text-center">
              {!isAuthenticated
                ? 'Please login to view your collection'
                : 'Failed to load collection. Please try again later.'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && characters.length === 0 && isAuthenticated && (
          <div className="flex justify-center items-center h-[480px]">
            <p className="text-gray-400 text-center">
              Your collection is empty. Start liking companions to build your collection!
            </p>
          </div>
        )}

        {/* Not Authenticated State */}
        {!isAuthenticated && !isLoading && (
          <div className="flex justify-center items-center h-[480px]">
            <p className="text-gray-400 text-center">Please login to view your collection</p>
          </div>
        )}

        {/* Collection Grid */}
        {!isLoading && !error && characters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {characters.map(character => (
              <CollectionCard key={character.id} character={character} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

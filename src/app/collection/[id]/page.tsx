'use client';

import { useMemo } from 'react';
import CharacterImages from '@/components/collection/CharacterImages';
import { notFound } from 'next/navigation';
import { useGetLikedBotsQuery } from '@/redux/services/botProfilesApi';
import { mapBotProfilesToCollectionCharacters } from '@/utils/mappers';
import { useAppSelector } from '@/redux/hooks';

// Using a more specific type to avoid the PageProps constraint issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CharacterPage({ params }: any) {
  const isAuthenticated = useAppSelector(
    state => (state.auth as { isAuthenticated?: boolean }).isAuthenticated ?? false,
  );
  const { data: likedBotsResponse, isLoading } = useGetLikedBotsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Map API response to collection characters
  const characters = useMemo(() => {
    return likedBotsResponse?.botProfiles
      ? mapBotProfilesToCollectionCharacters(likedBotsResponse.botProfiles)
      : [];
  }, [likedBotsResponse]);

  // Find the character by ID
  const character = useMemo(() => {
    if (!params?.id) return null;
    const id = String(params.id);
    return characters.find(c => c.id === id) || null;
  }, [params?.id, characters]);

  // Show loading state while fetching character
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Show 404 if character not found
  if (!character) {
    notFound();
  }

  return <CharacterImages character={character} />;
}

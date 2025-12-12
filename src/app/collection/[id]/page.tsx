'use client';

import { use, useMemo } from 'react';
import CharacterImages from '@/components/collection/CharacterImages';
import { notFound } from 'next/navigation';
import { useGetLikedBotsQuery } from '@/redux/services/botProfilesApi';
import { mapBotProfilesToCollectionCharacters } from '@/utils/mappers';
import { useAppSelector } from '@/redux/hooks';

// Next.js 16: params is now a Promise that needs to be unwrapped
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CharacterPage({ params }: PageProps) {
  // Unwrap the params Promise using React's use() hook
  const { id } = use(params);

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
    if (!id) return null;
    return characters.find(c => c.id === id) || null;
  }, [id, characters]);

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

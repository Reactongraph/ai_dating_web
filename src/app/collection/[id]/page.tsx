'use client';

import { useEffect, useState } from 'react';
import { mockCollection } from '@/data/collection';
import CharacterImages from '@/components/collection/CharacterImages';
import { notFound } from 'next/navigation';
import { CollectionCharacter } from '@/types/collection';

// Using a more specific type to avoid the PageProps constraint issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CharacterPage({ params }: any) {
  const [character, setCharacter] = useState<CollectionCharacter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the character in the mock data
    if (params && params.id) {
      const id = String(params.id); // Convert to string to ensure type safety
      const foundCharacter = mockCollection.characters.find((c) => c.id === id);
      setCharacter(foundCharacter || null);
    }
    setLoading(false);
  }, [params]);

  // Show loading state while fetching character
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show 404 if character not found
  if (!character) {
    notFound();
  }

  return <CharacterImages character={character} />;
}

'use client';

import { mockCollection } from '@/data/collection';
import CharacterImages from '@/components/collection/CharacterImages';
import { notFound } from 'next/navigation';

interface CharacterDisplayProps {
  id: string;
}

export default function CharacterDisplay({ id }: CharacterDisplayProps) {
  const character = mockCollection.characters.find(c => c.id === id);

  if (!character) {
    notFound();
  }

  return <CharacterImages character={character} />;
}

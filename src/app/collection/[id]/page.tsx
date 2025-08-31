'use client';

import { mockCollection } from '@/data/collection';
import CharacterImages from '@/components/collection/CharacterImages';
import { notFound } from 'next/navigation';

interface CharacterPageProps {
  params: {
    id: string;
  };
}

export default function CharacterPage({ params }: CharacterPageProps) {
  const character = mockCollection.characters.find((c) => c.id === params.id);

  if (!character) {
    notFound();
  }

  return <CharacterImages character={character} />;
}

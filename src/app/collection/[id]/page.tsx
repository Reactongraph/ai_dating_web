'use client';

import { mockCollection } from '@/data/collection';
import CharacterImages from '@/components/collection/CharacterImages';
import { notFound } from 'next/navigation';

interface CharacterPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = mockCollection.characters.find((c) => c.id === id);

  if (!character) {
    notFound();
  }

  return <CharacterImages character={character} />;
}

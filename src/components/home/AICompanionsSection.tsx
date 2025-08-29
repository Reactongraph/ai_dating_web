'use client';

import { useState } from 'react';
import CompanionCard, { Companion } from '@/components/cards/CompanionCard';
import CreateCompanionCard from '@/components/cards/CreateCompanionCard';
import CategoryTabs from '@/components/navigation/CategoryTabs';

const companionCategories = [
  {
    id: 'girls',
    label: 'Girls',
    companions: [
      {
        id: '1',
        name: 'Aley',
        age: 26,
        description:
          'Energetic woman who travels the world to find new experiences.Show morecreated at Sep',
        imageSrc: '/companions/aley.jpg',
        tags: ['Aley, 26', 'Caregiver'],
      },
      {
        id: '2',
        name: 'Fraha',
        age: 25,
        description:
          'Energetic woman who travels the world to find new experiences.Show morecreated at Sep',
        imageSrc: '/companions/fraha.jpg',
        tags: ['Aley, 26', 'Caregiver'],
      },
      {
        id: '3',
        name: 'Molley',
        age: 28,
        description:
          'Energetic woman who travels the world to find new experiences.Show morecreated at Sep',
        imageSrc: '/companions/molley.jpg',
        tags: ['Aley, 26', 'Caregiver'],
      },
      {
        id: '4',
        name: 'Sarah',
        age: 27,
        description:
          'Energetic woman who travels the world to find new experiences.Show morecreated at Sep',
        imageSrc: '/companions/sarah.jpg',
        tags: ['Aley, 26', 'Caregiver'],
      },
    ],
  },
  {
    id: 'guys',
    label: 'Guys',
    companions: [
      {
        id: 'g1',
        name: 'Alex',
        age: 28,
        description:
          'Charismatic and adventurous spirit seeking meaningful connections.Show morecreated at Sep',
        imageSrc: '/companions/alex.jpg',
        tags: ['Alex, 28', 'Adventurer'],
      },
      {
        id: 'g2',
        name: 'James',
        age: 30,
        description:
          'Creative soul with a passion for arts and deep conversations.Show morecreated at Sep',
        imageSrc: '/companions/james.jpg',
        tags: ['James, 30', 'Artist'],
      },
    ],
  },
  {
    id: 'anime',
    label: 'Anime',
    companions: [
      {
        id: 'a1',
        name: 'Sakura',
        age: 21,
        description:
          'Kawaii anime character with a sweet personality and magical powers.Show morecreated at Sep',
        imageSrc: '/companions/sakura.jpg',
        tags: ['Sakura, 21', 'Magical'],
      },
      {
        id: 'a2',
        name: 'Yuki',
        age: 23,
        description:
          'Mysterious anime companion with supernatural abilities.Show morecreated at Sep',
        imageSrc: '/companions/yuki.jpg',
        tags: ['Yuki, 23', 'Mysterious'],
      },
    ],
  },
];

const AICompanionsSection = () => {
  const [activeCategory, setActiveCategory] = useState('girls');

  const tabs = companionCategories.map((cat) => ({
    id: cat.id,
    label: cat.label,
  }));

  return (
    <section>
      {/* Banner Title */}
      <div className="relative w-full bg-gradient-to-r from-[#0066FF] via-[#7000FF] to-[#FF1493]">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-5xl font-bold text-white">
            Meet Your AI Companions
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-gray-400 text-lg text-center mb-12">
            From friendly to flirty — dive into a world of personalities crafted
            just for you.
          </p>

          {/* Tabs Navigation */}
          <div className="flex justify-center mb-12">
            <CategoryTabs
              tabs={tabs}
              activeTab={activeCategory}
              onTabChange={setActiveCategory}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CreateCompanionCard />
            {companionCategories
              .find((cat) => cat.id === activeCategory)
              ?.companions.map((companion) => (
                <CompanionCard key={companion.id} companion={companion} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICompanionsSection;

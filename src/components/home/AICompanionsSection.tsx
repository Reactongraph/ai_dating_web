'use client';

import { useState } from 'react';
import CompanionCard from '@/components/cards/CompanionCard';
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
        imageSrc: '/assets/cardgirl2.jpg',
        tags: ['Aley, 26', 'Caregiver'],
      },
      {
        id: '2',
        name: 'Fraha',
        age: 25,
        description:
          'Energetic woman who travels the world to find new experiences.Show morecreated at Sep',
        imageSrc: '/assets/cardgirl3.jpg',
        tags: ['Aley, 26', 'Caregiver'],
      },
      {
        id: '3',
        name: 'Molley',
        age: 28,
        description:
          'Energetic woman who travels the world to find new experiences.Show morecreated at Sep',
        imageSrc: '/assets/cardgirl2.jpg',
        tags: ['Aley, 26', 'Caregiver'],
      },
      {
        id: '4',
        name: 'Sarah',
        age: 27,
        description:
          'Energetic woman who travels the world to find new experiences.Show morecreated at Sep',
        imageSrc: '/assets/cardgirl3.jpg',
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
        imageSrc: '/assets/cardgirl2.jpg',
        tags: ['Alex, 28', 'Adventurer'],
      },
      {
        id: 'g2',
        name: 'James',
        age: 30,
        description:
          'Creative soul with a passion for arts and deep conversations.Show morecreated at Sep',
        imageSrc: '/assets/cardgirl3.jpg',
        tags: ['James, 30', 'Artist'],
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
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: 'url("/assets/meetai.png")' }}
      >
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

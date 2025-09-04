'use client';

import CreateCompanionCard from '@/components/cards/CreateCompanionCard';
import EnhancedCompanionCard, {
  Companion,
} from '@/components/cards/EnhancedCompanionCard';
import Image from 'next/image';

// Mock data for AI companions
const mockCompanions: Companion[] = [
  {
    id: '1',
    name: 'Fraha',
    age: 25,
    description:
      'Energetic woman who travels the world to find new experiences. Show more created at Sep',
    imageSrc: '/assets/models/girl1.jpg',
    tags: ['Aley, 26', 'Caregiver'],
  },
  {
    id: '2',
    name: 'Aley',
    age: 26,
    description:
      'Energetic woman who travels the world to find new experiences. Show more created at Sep',
    imageSrc: '/assets/models/girl2.jpg',
    tags: ['Aley, 26', 'Caregiver'],
  },
];

export default function MyAIPage() {
  const handleIconClick = (companionId: string) => {
    console.log('Icon clicked for companion:', companionId);
    // Add your icon click logic here (e.g., show menu, options, etc.)
  };

  const handleCardClick = (companionId: string) => {
    console.log('Card clicked for companion:', companionId);
    // Add your card click logic here (e.g., navigate to chat, companion details, etc.)
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">My AI</h1>
          <p className="text-gray-400 text-xl">
            Your characters come to life here — created by you, ready to chat
            anytime.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create AI Character Card */}
          <CreateCompanionCard
            href="/create-character"
            buttonText="Create AI Character"
            title="Create your own AI Girlfriend"
          />

          {/* Existing AI Companions */}
          {mockCompanions.map((companion) => (
            <EnhancedCompanionCard
              key={companion.id}
              companion={companion}
              topRightIcon={
                <Image
                  src="/assets/ping_chat_icon.svg"
                  alt="Chat"
                  width={26}
                  height={26}
                />
              }
              onIconClick={() => handleIconClick(companion.id)}
              onCardClick={() => handleCardClick(companion.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

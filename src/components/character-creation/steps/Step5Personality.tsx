'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';
import { useCharacterAttributes } from '@/hooks/useCharacterAttributes';
import { PersonalityResponse } from '@/redux/services/characterAttributesApi';

const Step5Personality: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();
  const { personalities } = useCharacterAttributes();

  const personality = watch('personality');
  console.log('personality', { personalities, personality });
  // Emoji mapping for personality types
  const personalityEmojis: Record<string, string> = {
    'toy boy': '😏',
    submissive: '🌸',
    protector: '🛡️',
    dominant: '👑',
    rebel: '🔥',
    lover: '❤️',
    beast: '💪',
    sage: '🧙‍♂️',
    scholar: '📚',
    confidant: '🤫',
    hero: '⚔️',
    jester: '🤡',
  };

  return (
    <div className="space-y-8">
      {/* Question */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">
          What is your character&apos;s personality?
        </h2>
      </div>

      {/* Personality Selection */}
      <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
        {personalities.map(
          (option: PersonalityResponse['personalityTypes'][0]) => (
            <div
              key={option._id}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                personality === option.name.toLowerCase()
                  ? 'ring-2 ring-primary-500'
                  : ''
              }`}
              onClick={() =>
                setValue(
                  'personality',
                  option.name.toLowerCase() as CharacterFormData['personality']
                )
              }
            >
              <div className="bg-gray-800 p-6 text-center h-full">
                {option.imageUrl ? (
                  <div
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${option.imageUrl})` }}
                  />
                ) : (
                  <div className="text-6xl mb-4">
                    {personalityEmojis[option.name.toLowerCase()] || '🎭'}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {option.name}
                </h3>
                {personality === option.name.toLowerCase() && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* Role Description */}
      {personality && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Role</h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {personalities.find(
              (p: PersonalityResponse['personalityTypes'][0]) =>
                p.name.toLowerCase() === personality
            )?.description || 'A unique personality type.'}
          </p>
        </div>
      )}

      {/* Hidden form inputs for React Hook Form */}
      <input type="hidden" {...register('personality')} />
    </div>
  );
};

export default Step5Personality;

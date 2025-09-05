'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';

const Step5Personality: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();

  const personality = watch('personality');

  const personalityOptions: Array<{
    value: CharacterFormData['personality'];
    label: string;
    emoji: string;
    description: string;
  }> = [
    {
      value: 'caregiver',
      label: 'Caregiver',
      emoji: '🤒',
      description: 'Nurturing, Protective and always there to offer comfort.',
    },
    {
      value: 'naughty',
      label: 'Naughty',
      emoji: '😏',
      description: 'Playful, Mischievous and full of surprises.',
    },
    {
      value: 'shy',
      label: 'Shy',
      emoji: '🥺',
      description: 'Timid, Reserved and sweetly innocent.',
    },
    {
      value: 'temptress',
      label: 'Temptress',
      emoji: '😘',
      description: 'Seductive, Alluring and irresistibly charming.',
    },
    {
      value: 'jester',
      label: 'Jester',
      emoji: '🤡',
      description: 'Funny, Entertaining and always making you laugh.',
    },
    {
      value: 'mistress',
      label: 'Mistress',
      emoji: '😇',
      description: 'Dominant, Confident and in control.',
    },
  ];

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
        {personalityOptions.map((option) => (
          <div
            key={option.value}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
              personality === option.value ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setValue('personality', option.value)}
          >
            <div className="bg-gray-800 p-6 text-center h-full">
              <div className="text-6xl mb-4">{option.emoji}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {option.label}
              </h3>
              {personality === option.value && (
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
        ))}
      </div>

      {/* Role Description */}
      {personality && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Role</h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {
              personalityOptions.find((p) => p.value === personality)
                ?.description
            }
          </p>
        </div>
      )}

      {/* Hidden form inputs for React Hook Form */}
      <input type="hidden" {...register('personality')} />
    </div>
  );
};

export default Step5Personality;

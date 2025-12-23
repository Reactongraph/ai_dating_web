'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';
import { useCharacterAttributes } from '@/hooks/useCharacterAttributes';

const Step7Relationship: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();
  const { relationships } = useCharacterAttributes();

  const relationship = watch('relationship');

  // Icon mapping for relationship types
  const relationshipIcons: Record<string, string> = {
    stranger: '🕵️',
    schoolmate: '🎓',
    colleague: '💼',
    friend: '👏',
    bestfriend: '🤝',
    girlfriend: '❤️',
    wife: '💍',
    mistress: '👑',
    stepsister: '💎',
    stepmom: '🔥',
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Question */}
      <div className="text-center">
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 px-2">
          What is your character&apos;s relationship like?
        </h2>
      </div>

      {/* Relationship Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto px-2">
        {relationships.map(option => (
          <div
            key={option._id}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
              relationship === option.name.toLowerCase() ? 'ring-2 ring-primary-500 shadow-lg' : ''
            }`}
            onClick={() =>
              setValue(
                'relationship',
                option.name.toLowerCase() as CharacterFormData['relationship'],
              )
            }
          >
            <div className="bg-gray-800 p-4 md:p-6 text-center h-full flex flex-col items-center justify-center">
              <div className="text-3xl md:text-4xl mb-2 md:mb-3">
                {relationshipIcons[option.name.toLowerCase()] || '💫'}
              </div>
              <h3 className="text-sm md:text-lg font-semibold text-white truncate w-full px-1">{option.name}</h3>
              {relationship === option.name.toLowerCase() && (
                <div className="absolute top-2 right-2 w-4 h-4 md:w-5 md:h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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

      {/* Hidden form inputs for React Hook Form */}
      <input type="hidden" {...register('relationship')} />
    </div>
  );
};

export default Step7Relationship;

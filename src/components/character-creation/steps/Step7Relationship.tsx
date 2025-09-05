'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';

const Step7Relationship: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();

  const relationship = watch('relationship');

  const relationshipOptions: Array<{
    value: CharacterFormData['relationship'];
    label: string;
    icon: string;
  }> = [
    { value: 'stranger', label: 'Stranger', icon: '🕵️' },
    { value: 'schoolmate', label: 'School Mate', icon: '🎓' },
    { value: 'colleague', label: 'Colleague', icon: '💼' },
    { value: 'friend', label: 'Friend', icon: '👏' },
    { value: 'bestfriend', label: 'Bestfriend', icon: '🤝' },
    { value: 'girlfriend', label: 'Girlfriend', icon: '❤️' },
    { value: 'wife', label: 'Wife', icon: '💍' },
    { value: 'mistress', label: 'Mistress', icon: '👑' },
    { value: 'stepsister', label: 'Stepsister', icon: '💎' },
    { value: 'stepmom', label: 'Stepmom', icon: '🔥' },
  ];

  return (
    <div className="space-y-8">
      {/* Question */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">
          What is your character&apos;s relationship like?
        </h2>
      </div>

      {/* Relationship Selection */}
      <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto">
        {relationshipOptions.map((option) => (
          <div
            key={option.value}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
              relationship === option.value ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setValue('relationship', option.value)}
          >
            <div className="bg-gray-800 p-6 text-center h-full">
              <div className="text-4xl mb-3">{option.icon}</div>
              <h3 className="text-lg font-semibold text-white">
                {option.label}
              </h3>
              {relationship === option.value && (
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

      {/* Hidden form inputs for React Hook Form */}
      <input type="hidden" {...register('relationship')} />
    </div>
  );
};

export default Step7Relationship;

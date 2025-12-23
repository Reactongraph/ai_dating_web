'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';
import { useCharacterAttributes } from '@/hooks/useCharacterAttributes';

const Step8Clothing: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();
  const { clothings } = useCharacterAttributes();

  const clothing = watch('clothing');

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Instruction */}
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 px-2">Choose your character&apos;s clothing</h2>
      </div>

      {/* Clothing Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 max-w-5xl mx-auto px-2">
        {clothings.map(option => (
          <button
            key={option._id}
            type="button"
            onClick={() =>
              setValue('clothing', option.name.toLowerCase() as CharacterFormData['clothing'])
            }
            className={`px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
              clothing === option.name.toLowerCase()
                ? 'bg-primary-500 text-white border-2 border-primary-500 shadow-md'
                : 'bg-gray-700 text-white border-2 border-gray-600 hover:border-gray-400'
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* Hidden form inputs for React Hook Form */}
      <input type="hidden" {...register('clothing')} />
    </div>
  );
};

export default Step8Clothing;

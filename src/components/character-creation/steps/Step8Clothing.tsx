'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';
import { useCharacterAttributes } from '@/hooks/useCharacterAttributes';

const Step8Clothing: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();
  const { clothings } = useCharacterAttributes();

  const clothing = watch('clothing');

  return (
    <div className="space-y-8">
      {/* Instruction */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">
          Choose your character&apos;s clothing
        </h2>
      </div>

      {/* Clothing Selection */}
      <div className="grid grid-cols-5 gap-3 max-w-5xl mx-auto">
        {clothings.map((option) => (
          <button
            key={option._id}
            type="button"
            onClick={() =>
              setValue(
                'clothing',
                option.name.toLowerCase() as CharacterFormData['clothing']
              )
            }
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              clothing === option.name.toLowerCase()
                ? 'bg-primary-500 text-white border-2 border-primary-500'
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

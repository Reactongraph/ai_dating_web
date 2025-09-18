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
          <div
            key={option._id}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
              clothing === option.name.toLowerCase()
                ? 'ring-2 ring-primary-500'
                : ''
            }`}
            onClick={() =>
              setValue(
                'clothing',
                option.name.toLowerCase() as CharacterFormData['clothing']
              )
            }
          >
            <div
              className="relative h-40 bg-cover bg-center"
              style={{
                backgroundImage: `url("${option.imageUrl || '/assets/clothing/default.jpg'}")`,
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <h3 className="text-sm font-medium text-white">
                  {option.name}
                </h3>
              </div>
              {clothing === option.name.toLowerCase() && (
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
      <input type="hidden" {...register('clothing')} />
    </div>
  );
};

export default Step8Clothing;

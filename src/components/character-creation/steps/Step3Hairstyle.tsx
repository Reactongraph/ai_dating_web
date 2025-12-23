'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';
import { useCharacterAttributes } from '@/hooks/useCharacterAttributes';

const Step3Hairstyle: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();
  const { hairStyles, hairColors } = useCharacterAttributes();

  const hairstyle = watch('hairstyle');
  const hairColor = watch('hairColor');
  const age = watch('age');

  const ageOptions: CharacterFormData['age'][] = ['18+', '20s', '30s', '40s', '50s'];
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hairstyle Selection */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Choose hairstyle</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {hairStyles.map(option => (
            <div
              key={option._id}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                hairstyle === option.name.toLowerCase() ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() =>
                setValue('hairstyle', option.name.toLowerCase() as CharacterFormData['hairstyle'])
              }
            >
              <div
                className="relative h-24 md:h-32 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${option.imageUrl || '/assets/hairstyles/default.jpg'}")`,
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-0 right-0 text-center px-1">
                  <h3 className="text-xs md:text-sm font-medium text-white truncate">{option.name}</h3>
                </div>
                {hairstyle === option.name.toLowerCase() && (
                  <div className="absolute top-2 right-2 w-4 h-4 md:w-5 md:h-5 bg-primary-500 rounded-full flex items-center justify-center">
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
      </div>

      {/* Hair Color Selection */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Hair color</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {hairColors.map(option => (
            <div
              key={option._id}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                hairColor === option.name.toLowerCase() ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() =>
                setValue('hairColor', option.name.toLowerCase() as CharacterFormData['hairColor'])
              }
            >
              <div
                className="relative h-24 md:h-32 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${option.imageUrl})` || option.name.toLowerCase(),
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-0 right-0 text-center px-1">
                  <h3 className="text-xs md:text-sm font-medium text-white truncate">{option.name}</h3>
                </div>
                {hairColor === option.name.toLowerCase() && (
                  <div className="absolute top-2 right-2 w-4 h-4 md:w-5 md:h-5 bg-primary-500 rounded-full flex items-center justify-center">
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
      </div>

      {/* Age Selection */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Choose age</h2>
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 px-2">
          {ageOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setValue('age', option)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-lg font-medium transition-all ${
                age === option
                  ? 'bg-primary-500 text-white border-2 border-primary-500 shadow-lg'
                  : 'bg-gray-700 text-white border-2 border-gray-600 hover:border-gray-400'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden form inputs for React Hook Form */}
      <input type="hidden" {...register('hairstyle')} />
      <input type="hidden" {...register('hairColor')} />
      <input type="hidden" {...register('age')} />
    </div>
  );
};

export default Step3Hairstyle;

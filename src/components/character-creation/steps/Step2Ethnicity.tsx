'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';
import { useCharacterAttributes } from '@/hooks/useCharacterAttributes';

const Step2Ethnicity: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();
  const { ethnicities, eyeColors } = useCharacterAttributes();

  const ethnicity = watch('ethnicity');
  const eyeColor = watch('eyeColor');

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Ethnicity Selection */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Choose ethnicity</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
          {ethnicities.map(option => (
            <div
              key={option._id}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                ethnicity === option.name.toLowerCase() ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() =>
                setValue('ethnicity', option.name.toLowerCase() as CharacterFormData['ethnicity'])
              }
            >
              <div
                className="relative h-24 md:h-32 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${option.imageUrl || '/assets/ethnicity/default.jpg'}")`,
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-xs md:text-sm font-medium text-white">{option.name}</h3>
                </div>
                {ethnicity === option.name.toLowerCase() && (
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

      {/* Eye Color Selection */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Choose eye color</h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          {eyeColors.map(option => (
            <div
              key={option._id}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all shrink-0 ${
                eyeColor === option.name.toLowerCase() ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() =>
                setValue('eyeColor', option.name.toLowerCase() as CharacterFormData['eyeColor'])
              }
            >
              <div
                className="relative h-16 w-16 md:h-24 md:w-24 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${option.imageUrl || '/assets/eyes/default.jpg'}")`,
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-1.5 md:bottom-2 left-0 right-0 text-center px-1">
                  <h3 className="text-[10px] md:text-sm font-medium text-white truncate">{option.name}</h3>
                </div>
                {eyeColor === option.name.toLowerCase() && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 md:w-5 md:h-5 bg-primary-500 rounded-full flex items-center justify-center">
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

      {/* Hidden form inputs for React Hook Form */}
      <input type="hidden" {...register('ethnicity')} />
      <input type="hidden" {...register('eyeColor')} />
    </div>
  );
};

export default Step2Ethnicity;

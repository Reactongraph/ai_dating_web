'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';
import { useCharacterAttributes } from '@/hooks/useCharacterAttributes';

const Step1Create: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();
  const { styles } = useCharacterAttributes();

  const characterType = watch('characterType');
  const style = watch('style');

  return (
    <div className="space-y-8">
      {/* Character Type Selection */}
      <div className="text-center">
        <div className="flex justify-center space-x-4 mb-6">
          {(['girl', 'guy'] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setValue('characterType', type)}
              className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${
                characterType === type
                  ? 'bg-white text-black border-2 border-white'
                  : 'bg-transparent text-white border-2 border-gray-600 hover:border-gray-400'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <p className="text-gray-300 text-lg">Choose the style of your character</p>
      </div>

      {/* Style Selection */}
      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        {styles.map(styleOption => (
          <div
            key={styleOption._id}
            className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all ${
              style === styleOption.name.toLowerCase() ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() =>
              setValue('style', styleOption.name.toLowerCase() as CharacterFormData['style'])
            }
          >
            <div
              className="relative h-64 bg-cover bg-center"
              style={{
                backgroundImage: `url("${styleOption.imageUrl || '/assets/cardgirl1.png'}")`,
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <h3 className="text-xl font-semibold text-white">{styleOption.name}</h3>
              </div>
              {style === styleOption.name.toLowerCase() && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
      <input type="hidden" {...register('characterType')} />
      <input type="hidden" {...register('style')} />
    </div>
  );
};

export default Step1Create;

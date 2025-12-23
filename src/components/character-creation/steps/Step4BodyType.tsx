'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';
import { useCharacterAttributes } from '@/hooks/useCharacterAttributes';
import { useAppSelector } from '@/redux/hooks';

const Step4BodyType: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();
  const { bodyTypes, breastSizes, buttSizes } = useCharacterAttributes();
  const botType = useAppSelector(state => state.characterAttributes.botType);

  const bodyType = watch('bodyType');
  const breastSize = watch('breastSize');
  const bootySize = watch('bootySize');

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Body Type Selection */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Choose body type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-6xl mx-auto">
          {bodyTypes.map(option => (
            <div
              key={option._id}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                bodyType === option.name.toLowerCase() ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() =>
                setValue('bodyType', option.name.toLowerCase() as CharacterFormData['bodyType'])
              }
            >
              <div
                className="relative h-28 md:h-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${option.imageUrl || '/assets/body-types/default.jpg'}")`,
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-0 right-0 text-center px-1">
                  <h3 className="text-xs md:text-sm font-medium text-white truncate">{option.name}</h3>
                </div>
                {bodyType === option.name.toLowerCase() && (
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

      {/* Breast Size Selection - Girl Only */}
      {botType === 'girl' && (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Choose breast size</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-6xl mx-auto">
            {breastSizes.map(option => (
              <div
                key={option._id}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                  breastSize === option.name.toLowerCase() ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() =>
                  setValue(
                    'breastSize',
                    option.name.toLowerCase() as CharacterFormData['breastSize'],
                  )
                }
              >
                <div
                  className="relative h-28 md:h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${option.imageUrl || '/assets/breast-sizes/default.jpg'}")`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-2 left-0 right-0 text-center px-1">
                    <h3 className="text-xs md:text-sm font-medium text-white truncate">{option.name}</h3>
                  </div>
                  {breastSize === option.name.toLowerCase() && (
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
      )}

      {/* Booty Size Selection - Girl Only */}
      {botType === 'girl' && (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Choose booty size</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-6xl mx-auto">
            {buttSizes.map(option => (
              <div
                key={option._id}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                  bootySize === option.name.toLowerCase() ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() =>
                  setValue('bootySize', option.name.toLowerCase() as CharacterFormData['bootySize'])
                }
              >
                <div
                  className="relative h-28 md:h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${option.imageUrl || '/assets/booty-sizes/default.jpg'}")`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-2 left-0 right-0 text-center px-1">
                    <h3 className="text-xs md:text-sm font-medium text-white truncate">{option.name}</h3>
                  </div>
                  {bootySize === option.name.toLowerCase() && (
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
      )}

      {/* Hidden form inputs for React Hook Form */}
      <input type="hidden" {...register('bodyType')} />
      <input type="hidden" {...register('breastSize')} />
      <input type="hidden" {...register('bootySize')} />
    </div>
  );
};

export default Step4BodyType;

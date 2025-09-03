'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';

const Step4BodyType: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();

  const bodyType = watch('bodyType');
  const breastSize = watch('breastSize');
  const bootySize = watch('bootySize');

  const bodyTypeOptions = [
    {
      value: 'petite',
      label: 'Petite',
      image: '/assets/body-types/petite.jpg',
    },
    { value: 'slim', label: 'Slim', image: '/assets/body-types/slim.jpg' },
    {
      value: 'athletic',
      label: 'Athletic',
      image: '/assets/body-types/athletic.jpg',
    },
    { value: 'curvy', label: 'Curvy', image: '/assets/body-types/curvy.jpg' },
    {
      value: 'voluptuous',
      label: 'Voluptuous',
      image: '/assets/body-types/voluptuous.jpg',
    },
  ];

  const breastSizeOptions = [
    { value: 'flat', label: 'Flat', image: '/assets/breast-sizes/flat.jpg' },
    { value: 'small', label: 'Small', image: '/assets/breast-sizes/small.jpg' },
    {
      value: 'medium',
      label: 'Medium',
      image: '/assets/breast-sizes/medium.jpg',
    },
    { value: 'large', label: 'Large', image: '/assets/breast-sizes/large.jpg' },
    { value: 'huge', label: 'Huge', image: '/assets/breast-sizes/huge.jpg' },
  ];

  const bootySizeOptions = [
    { value: 'small', label: 'Small', image: '/assets/booty-sizes/small.jpg' },
    {
      value: 'medium',
      label: 'Medium',
      image: '/assets/booty-sizes/medium.jpg',
    },
    { value: 'large', label: 'Large', image: '/assets/booty-sizes/large.jpg' },
    {
      value: 'athletic',
      label: 'Athletic',
      image: '/assets/booty-sizes/athletic.jpg',
    },
    { value: 'curvy', label: 'Curvy', image: '/assets/booty-sizes/curvy.jpg' },
  ];

  return (
    <div className="space-y-8">
      {/* Body Type Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Choose body types
        </h2>
        <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
          {bodyTypeOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                bodyType === option.value ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setValue('bodyType', option.value)}
            >
              <div
                className="relative h-40 bg-cover bg-center"
                style={{ backgroundImage: `url("${option.image}")` }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-medium text-white">
                    {option.label}
                  </h3>
                </div>
                {bodyType === option.value && (
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
      </div>

      {/* Breast Size Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Choose breast-cup size
        </h2>
        <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
          {breastSizeOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                breastSize === option.value ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setValue('breastSize', option.value)}
            >
              <div
                className="relative h-40 bg-cover bg-center"
                style={{ backgroundImage: `url("${option.image}")` }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-medium text-white">
                    {option.label}
                  </h3>
                </div>
                {breastSize === option.value && (
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
      </div>

      {/* Booty Size Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Choose booty size
        </h2>
        <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
          {bootySizeOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                bootySize === option.value ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setValue('bootySize', option.value)}
            >
              <div
                className="relative h-40 bg-cover bg-center"
                style={{ backgroundImage: `url("${option.image}")` }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-medium text-white">
                    {option.label}
                  </h3>
                </div>
                {bootySize === option.value && (
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
      </div>

      {/* Hidden form inputs for React Hook Form */}
      <input type="hidden" {...register('bodyType')} />
      <input type="hidden" {...register('breastSize')} />
      <input type="hidden" {...register('bootySize')} />
    </div>
  );
};

export default Step4BodyType;

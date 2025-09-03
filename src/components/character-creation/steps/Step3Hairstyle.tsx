'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';

const Step3Hairstyle: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();

  const hairstyle = watch('hairstyle');
  const hairColor = watch('hairColor');
  const age = watch('age');

  const hairstyleOptions = [
    {
      value: 'ponytail',
      label: 'Ponytail',
      image: '/assets/hairstyles/ponytail.jpg',
    },
    { value: 'braid', label: 'Braid', image: '/assets/hairstyles/braid.jpg' },
    { value: 'bun', label: 'Bun', image: '/assets/hairstyles/bun.jpg' },
    {
      value: 'straight',
      label: 'Straight',
      image: '/assets/hairstyles/straight.jpg',
    },
    { value: 'wavy', label: 'Wavy', image: '/assets/hairstyles/wavy.jpg' },
    { value: 'curly', label: 'Curly', image: '/assets/hairstyles/curly.jpg' },
    { value: 'short', label: 'Short', image: '/assets/hairstyles/short.jpg' },
  ];

  const hairColorOptions = [
    { value: 'blonde', label: 'Blonde', color: '#F4D03F' },
    { value: 'brown', label: 'Brown', color: '#8B4513' },
    { value: 'black', label: 'Black', color: '#000000' },
    { value: 'red', label: 'Red', color: '#DC143C' },
    { value: 'gray', label: 'Gray', color: '#808080' },
    { value: 'white', label: 'White', color: '#FFFFFF' },
    { value: 'blue', label: 'Blue', color: '#0000FF' },
    { value: 'pink', label: 'Pink', color: '#FF69B4' },
    { value: 'purple', label: 'Purple', color: '#800080' },
  ];

  const ageOptions = ['18+', '20s', '30s', '40s', '50s', 'custom'];

  return (
    <div className="space-y-8">
      {/* Hairstyle Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Choose hairstyle
        </h2>
        <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto">
          {hairstyleOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                hairstyle === option.value ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setValue('hairstyle', option.value)}
            >
              <div
                className="relative h-32 bg-cover bg-center"
                style={{ backgroundImage: `url("${option.image}")` }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-medium text-white">
                    {option.label}
                  </h3>
                </div>
                {hairstyle === option.value && (
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

      {/* Hair Color Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">Hair color</h2>
        <div className="flex justify-center flex-wrap gap-4 max-w-4xl mx-auto">
          {hairColorOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer transition-all ${
                hairColor === option.value ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setValue('hairColor', option.value)}
            >
              <div
                className="w-16 h-16 rounded-full border-2 border-gray-600"
                style={{ backgroundColor: option.color }}
              />
              <div className="text-center mt-2">
                <span className="text-sm text-white">{option.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Age Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">Choose age</h2>
        <div className="flex justify-center flex-wrap gap-4">
          {ageOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setValue('age', option)}
              className={`px-6 py-3 rounded-lg text-lg font-medium transition-all ${
                age === option
                  ? 'bg-primary-500 text-white border-2 border-primary-500'
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

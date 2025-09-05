'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';

const Step2Ethnicity: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();

  const ethnicity = watch('ethnicity');
  const eyeColor = watch('eyeColor');

  const ethnicityOptions: Array<{
    value: CharacterFormData['ethnicity'];
    label: string;
    image: string;
  }> = [
    {
      value: 'caucasian',
      label: 'Caucasian',
      image: '/assets/ethnicity/caucasian.jpg',
    },
    { value: 'latina', label: 'Latina', image: '/assets/ethnicity/latina.jpg' },
    { value: 'asian', label: 'Asian', image: '/assets/ethnicity/asian.jpg' },
    {
      value: 'middle-eastern',
      label: 'Middle Eastern',
      image: '/assets/ethnicity/middle-eastern.jpg',
    },
    {
      value: 'african',
      label: 'African',
      image: '/assets/ethnicity/african.jpg',
    },
    {
      value: 'native-american',
      label: 'Native American',
      image: '/assets/ethnicity/native-american.jpg',
    },
  ];

  const eyeColorOptions: Array<{
    value: CharacterFormData['eyeColor'];
    label: string;
    image: string;
  }> = [
    { value: 'blue', label: 'Blue', image: '/assets/eyes/blue.jpg' },
    { value: 'green', label: 'Green', image: '/assets/eyes/green.jpg' },
    { value: 'brown', label: 'Brown', image: '/assets/eyes/brown.jpg' },
  ];

  return (
    <div className="space-y-8">
      {/* Ethnicity Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Choose ethnicity
        </h2>
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {ethnicityOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                ethnicity === option.value ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setValue('ethnicity', option.value)}
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
                {ethnicity === option.value && (
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

      {/* Eye Color Selection */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Choose eye color
        </h2>
        <div className="flex justify-center space-x-6">
          {eyeColorOptions.map((option) => (
            <div
              key={option.value}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                eyeColor === option.value ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setValue('eyeColor', option.value)}
            >
              <div
                className="relative h-24 w-24 bg-cover bg-center"
                style={{ backgroundImage: `url("${option.image}")` }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-medium text-white">
                    {option.label}
                  </h3>
                </div>
                {eyeColor === option.value && (
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
      <input type="hidden" {...register('ethnicity')} />
      <input type="hidden" {...register('eyeColor')} />
    </div>
  );
};

export default Step2Ethnicity;

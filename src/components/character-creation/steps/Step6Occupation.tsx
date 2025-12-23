'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';
import { useCharacterAttributes } from '@/hooks/useCharacterAttributes';

const Step6Occupation: React.FC = () => {
  const { register, watch, setValue } = useFormContext<CharacterFormData>();
  const { occupations } = useCharacterAttributes();

  const occupation = watch('occupation');
  const hobbies = watch('hobbies') || [];

  const hobbyOptions = [
    'reading',
    'gaming',
    'sports',
    'music',
    'cooking',
    'travel',
    'photography',
    'dancing',
    'painting',
    'writing',
    'gardening',
    'fitness',
    'movies',
    'shopping',
    'volunteering',
  ];

  const handleHobbyToggle = (hobby: string) => {
    if (hobbies.includes(hobby)) {
      setValue(
        'hobbies',
        hobbies.filter(h => h !== hobby),
      );
    } else if (hobbies.length < 3) {
      setValue('hobbies', [...hobbies, hobby]);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Occupation Selection */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Choose occupation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 max-w-5xl mx-auto px-2">
          {occupations.map(option => (
            <button
              key={option._id}
              type="button"
              onClick={() =>
                setValue('occupation', option.name.toLowerCase() as CharacterFormData['occupation'])
              }
              className={`px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                occupation === option.name.toLowerCase()
                  ? 'bg-primary-500 text-white border-2 border-primary-500 shadow-md'
                  : 'bg-gray-700 text-white border-2 border-gray-600 hover:border-gray-400'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hobbies Selection */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-1 md:mb-2">Choose hobbies</h2>
        <p className="text-center text-gray-300 text-xs md:text-sm mb-4 md:mb-6 px-4">You can choose up to 3 variants</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 max-w-5xl mx-auto px-2">
          {hobbyOptions.map(hobby => (
            <button
              key={hobby}
              type="button"
              onClick={() => handleHobbyToggle(hobby)}
              disabled={!hobbies.includes(hobby) && hobbies.length >= 3}
              className={`px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                hobbies.includes(hobby)
                  ? 'bg-primary-500 text-white border-2 border-primary-500 shadow-md'
                  : 'bg-gray-700 text-white border-2 border-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {hobby.charAt(0).toUpperCase() + hobby.slice(1)}
            </button>
          ))}
        </div>

        {/* Selected Hobbies Count */}
        <div className="text-center mt-4">
          <span className="text-xs md:text-sm text-gray-400 font-medium">Selected: <span className="text-primary-400">{hobbies.length}</span>/3</span>
        </div>
      </div>

      {/* Hidden form inputs for React Hook Form */}
      <input type="hidden" {...register('occupation')} />
      <input type="hidden" {...register('hobbies')} />
    </div>
  );
};

export default Step6Occupation;

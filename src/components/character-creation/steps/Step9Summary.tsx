'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';

const Step9Summary: React.FC = () => {
  const { watch } = useFormContext<CharacterFormData>();

  const formData = watch();

  const summaryItems = [
    { label: 'Style', value: formData.style, category: 'Style' },
    { label: 'Occupation', value: formData.occupation, category: 'Occupation' },
    {
      label: 'Hobby',
      value: formData.hobbies?.[0] || 'None',
      category: 'Hobbie',
    },
    { label: 'Eye Color', value: formData.eyeColor, category: 'Eye Color' },
    { label: 'Clothing', value: formData.clothing, category: 'Clothing' },
    { label: 'Age', value: formData.age, category: 'Age' },
    { label: 'Eye Color', value: formData.eyeColor, category: 'Eye Color' },
    { label: 'Hairstyle', value: formData.hairstyle, category: 'Hairstyle' },
    { label: 'Hair Color', value: formData.hairColor, category: 'Hair Color' },
    { label: 'Ethnicity', value: formData.ethnicity, category: 'Ethnicity' },
    { label: 'Body Type', value: formData.bodyType, category: 'Body Type' },
    {
      label: 'Breast Size',
      value: formData.breastSize,
      category: 'Breast Size',
    },
    {
      label: 'Personality',
      value: formData.personality,
      category: 'Personality',
    },
    { label: 'Booty Size', value: formData.bootySize, category: 'Booty Size' },
    {
      label: 'Relationship',
      value: formData.relationship,
      category: 'Relationship',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Summary</h2>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className={`relative bg-gray-800 rounded-lg overflow-hidden ${
              item.value && item.value !== 'None'
                ? 'ring-2 ring-primary-500'
                : ''
            }`}
          >
            {item.value && item.value !== 'None' ? (
              <>
                {/* Image placeholder - in real app, this would show the actual selected image */}
                <div className="h-32 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">{item.label}</span>
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-lg font-semibold text-white">
                    {item.value}
                  </h3>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>
                {/* Checkmark for selected items */}
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
              </>
            ) : (
              <div className="h-32 bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Not selected</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Character Type and Style Summary */}
      <div className="text-center">
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Character Overview</h3>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-gray-400">Type: </span>
              <span className="text-white font-medium">
                {formData.characterType}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Style: </span>
              <span className="text-white font-medium">{formData.style}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step9Summary;

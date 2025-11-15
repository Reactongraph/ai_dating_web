'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData } from '@/types/character';
import { useCharacterAttributes } from '@/hooks/useCharacterAttributes';
import { useAppSelector } from '@/redux/hooks';
import ImageWithFallback from '@/components/common/ImageWithFallback';

interface Attribute {
  _id: string;
  name: string;
  botType?: string;
  image?: { s3Location?: string; path?: string };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface SummaryItem {
  label: string;
  value: string;
  category: string;
  image?: string;
}

const Step9Summary: React.FC = () => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<CharacterFormData>();
  const botType = useAppSelector(state => state.characterAttributes.botType);

  const {
    styles,
    ethnicities,
    eyeColors,
    hairStyles,
    hairColors,
    bodyTypes,
    breastSizes,
    buttSizes,
    clothings,
    personalities,
    occupations,
    relationships,
  } = useCharacterAttributes();

  const formData = watch();

  // Helper function to find attribute name by value
  const findAttributeName = (value: string | undefined, attributes: Array<Attribute>) => {
    if (!value) return 'Not selected';
    const attribute = attributes.find(a => a.name.toLowerCase() === value.toLowerCase());
    return attribute?.name || value;
  };

  // Create summary items based on botType
  const getSummaryItems = (): SummaryItem[] => {
    const baseItems: SummaryItem[] = [
      {
        label: 'Style',
        value: findAttributeName(formData.style, styles),
        category: 'Style',
        image: styles.find((s: Attribute) => s.name.toLowerCase() === formData.style)?.imageUrl,
      },
      {
        label: 'Occupation',
        value: findAttributeName(formData.occupation, occupations),
        category: 'Occupation',
        image: occupations.find((o: Attribute) => o.name.toLowerCase() === formData.occupation)
          ?.imageUrl,
      },
      {
        label: 'Hobby',
        value: formData.hobbies?.[0] || 'None',
        category: 'Hobby',
      },
      {
        label: 'Eye Color',
        value: findAttributeName(formData.eyeColor, eyeColors),
        category: 'Eye Color',
        image: eyeColors.find((e: Attribute) => e.name.toLowerCase() === formData.eyeColor)
          ?.imageUrl,
      },
      {
        label: 'Clothing',
        value: findAttributeName(formData.clothing, clothings),
        category: 'Clothing',
        image: clothings.find((c: Attribute) => c.name.toLowerCase() === formData.clothing)
          ?.imageUrl,
      },
      {
        label: 'Age',
        value: formData.age,
        category: 'Age',
      },
      {
        label: 'Hairstyle',
        value: findAttributeName(formData.hairstyle, hairStyles),
        category: 'Hairstyle',
        image: hairStyles.find((h: Attribute) => h.name.toLowerCase() === formData.hairstyle)
          ?.imageUrl,
      },
      {
        label: 'Hair Color',
        value: findAttributeName(formData.hairColor, hairColors),
        category: 'Hair Color',
        image: hairColors.find((h: Attribute) => h.name.toLowerCase() === formData.hairColor)
          ?.imageUrl,
      },
      {
        label: 'Ethnicity',
        value: findAttributeName(formData.ethnicity, ethnicities),
        category: 'Ethnicity',
        image: ethnicities.find((e: Attribute) => e.name.toLowerCase() === formData.ethnicity)
          ?.imageUrl,
      },
      {
        label: 'Body Type',
        value: findAttributeName(formData.bodyType, bodyTypes),
        category: 'Body Type',
        image: bodyTypes.find((b: Attribute) => b.name.toLowerCase() === formData.bodyType)
          ?.imageUrl,
      },
      {
        label: 'Personality',
        value: findAttributeName(formData.personality, personalities),
        category: 'Personality',
        image: personalities.find((p: Attribute) => p.name.toLowerCase() === formData.personality)
          ?.imageUrl,
      },
      {
        label: 'Relationship',
        value: findAttributeName(formData.relationship, relationships),
        category: 'Relationship',
        image: relationships.find((r: Attribute) => r.name.toLowerCase() === formData.relationship)
          ?.imageUrl,
      },
    ];

    // Add girl-specific attributes
    if (botType === 'girl') {
      baseItems.splice(
        10,
        0,
        {
          label: 'Breast Size',
          value: findAttributeName(formData.breastSize, breastSizes),
          category: 'Breast Size',
          image: breastSizes.find((b: Attribute) => b.name.toLowerCase() === formData.breastSize)
            ?.imageUrl,
        },
        {
          label: 'Booty Size',
          value: findAttributeName(formData.bootySize, buttSizes),
          category: 'Booty Size',
          image: buttSizes.find((b: Attribute) => b.name.toLowerCase() === formData.bootySize)
            ?.imageUrl,
        },
      );
    }

    return baseItems;
  };

  const summaryItems = getSummaryItems();

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
              item.value && item.value !== 'None' ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            {item.value && item.value !== 'None' ? (
              <>
                <div className="h-32 bg-gray-700 flex items-center justify-center">
                  {item.image ? (
                    <ImageWithFallback
                      src={item.image}
                      alt={item.label}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      fallbackSrc={`/assets/${item.category.toLowerCase()}-placeholder.jpg`}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">{item.label}</span>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-lg font-semibold text-white">{item.value}</h3>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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

          {/* Name Input Field and Model Selection */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            {/* Character Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Character Name *
              </label>
              <input
                {...register('name', {
                  required: 'Character name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters long',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Name must be less than 50 characters',
                  },
                })}
                type="text"
                id="name"
                placeholder="Enter character name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            {/* Model Selection */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
                AI Model *
              </label>
              <select
                {...register('model', {
                  required: 'AI Model is required',
                })}
                id="model"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select AI Model</option>
                <option value="qwen-image">SFW Image</option>
                <option value="lustify-sdxl">NSFW Level 1</option>
                <option value="pony-realism">NSFW Level 2</option>
                <option value="venice-sd35">NSFW Level 3</option>
              </select>
              {errors.model && <p className="mt-1 text-sm text-red-400">{errors.model.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-gray-400">Type: </span>
              <span className="text-white font-medium">{formData.characterType}</span>
            </div>
            <div>
              <span className="text-gray-400">Style: </span>
              <span className="text-white font-medium">
                {findAttributeName(formData.style, styles)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step9Summary;

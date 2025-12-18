import { CharacterFormData } from '@/types/character';

interface Attribute {
  _id: string;
  name: string;
  botType?: string;
  image?: { s3Location?: string; path?: string };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface CharacterAttributes {
  styles: Attribute[];
  ethnicities: Attribute[];
  eyeColors: Attribute[];
  hairStyles: Attribute[];
  hairColors: Attribute[];
  bodyTypes: Attribute[];
  breastSizes: Attribute[];
  buttSizes: Attribute[];
  clothings: Attribute[];
  personalities: Attribute[];
  occupations: Attribute[];
  relationships: Attribute[];
}

const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomHobbies = (): string[] => {
  const hobbies = [
    'Reading',
    'Gaming',
    'Cooking',
    'Traveling',
    'Photography',
    'Music',
    'Dancing',
    'Sports',
    'Art',
    'Yoga',
    'Hiking',
    'Swimming',
    'Painting',
    'Writing',
    'Gardening',
  ];

  const numberOfHobbies = Math.floor(Math.random() * 3) + 1; // 1-3 hobbies
  const selectedHobbies: string[] = [];

  for (let i = 0; i < numberOfHobbies; i++) {
    const hobby = getRandomItem(hobbies);
    if (!selectedHobbies.includes(hobby)) {
      selectedHobbies.push(hobby);
    }
  }

  return selectedHobbies;
};

const getRandomName = (characterType: 'girl' | 'guy' | 'anime'): string => {
  const girlNames = [
    'Emma',
    'Olivia',
    'Ava',
    'Isabella',
    'Sophia',
    'Mia',
    'Charlotte',
    'Amelia',
    'Harper',
    'Evelyn',
    'Luna',
    'Aria',
    'Scarlett',
    'Chloe',
    'Madison',
  ];

  const guyNames = [
    'Liam',
    'Noah',
    'Oliver',
    'Elijah',
    'James',
    'William',
    'Benjamin',
    'Lucas',
    'Henry',
    'Alexander',
    'Mason',
    'Michael',
    'Ethan',
    'Daniel',
    'Jacob',
  ];

  if (characterType === 'girl') {
    return getRandomItem(girlNames);
  } else {
    return getRandomItem(guyNames);
  }
};

export const generateRandomProfile = (
  characterType: 'girl' | 'guy' | 'anime',
  style: 'realistic' | 'anime',
  attributes: CharacterAttributes,
): Partial<CharacterFormData> => {
  const randomProfile: Partial<CharacterFormData> = {
    characterType,
    style,
    ethnicity:
      attributes.ethnicities.length > 0
        ? (getRandomItem(
            attributes.ethnicities,
          ).name.toLowerCase() as CharacterFormData['ethnicity'])
        : 'caucasian',
    eyeColor:
      attributes.eyeColors.length > 0
        ? (getRandomItem(attributes.eyeColors).name.toLowerCase() as CharacterFormData['eyeColor'])
        : 'blue',
    hairstyle:
      attributes.hairStyles.length > 0
        ? (getRandomItem(
            attributes.hairStyles,
          ).name.toLowerCase() as CharacterFormData['hairstyle'])
        : 'ponytail',
    hairColor:
      attributes.hairColors.length > 0
        ? (getRandomItem(
            attributes.hairColors,
          ).name.toLowerCase() as CharacterFormData['hairColor'])
        : 'brown',
    age: getRandomItem(['18+', '20s', '30s', '40s', '50s'] as CharacterFormData['age'][]),
    bodyType:
      attributes.bodyTypes.length > 0
        ? (getRandomItem(attributes.bodyTypes).name.toLowerCase() as CharacterFormData['bodyType'])
        : 'petite',
    personality:
      attributes.personalities.length > 0
        ? (getRandomItem(
            attributes.personalities,
          ).name.toLowerCase() as CharacterFormData['personality'])
        : 'caregiver',
    occupation:
      attributes.occupations.length > 0
        ? (getRandomItem(
            attributes.occupations,
          ).name.toLowerCase() as CharacterFormData['occupation'])
        : 'student',
    hobbies: getRandomHobbies(),
    relationship:
      attributes.relationships.length > 0
        ? (getRandomItem(
            attributes.relationships,
          ).name.toLowerCase() as CharacterFormData['relationship'])
        : 'stranger',
    clothing:
      attributes.clothings.length > 0
        ? (getRandomItem(attributes.clothings).name.toLowerCase() as CharacterFormData['clothing'])
        : 'casual',
    name: getRandomName(characterType),
  };

  // Add girl-specific attributes
  if (characterType === 'girl') {
    randomProfile.breastSize =
      attributes.breastSizes.length > 0
        ? (getRandomItem(
            attributes.breastSizes,
          ).name.toLowerCase() as CharacterFormData['breastSize'])
        : 'medium';
    randomProfile.bootySize =
      attributes.buttSizes.length > 0
        ? (getRandomItem(attributes.buttSizes).name.toLowerCase() as CharacterFormData['bootySize'])
        : 'medium';
  }

  return randomProfile;
};

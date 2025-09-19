import { BotProfile } from '@/redux/services/botProfilesApi';
import { Companion } from '@/components/cards/CompanionCard';
import { Companion as EnhancedCompanion } from '@/components/cards/EnhancedCompanionCard';

export const mapBotProfilesToCompanions = (
  profiles: BotProfile[]
): Companion[] => {
  return profiles.map((profile) => ({
    id: profile._id,
    name: profile.name,
    age: parseInt(profile.age) || 20,
    description: profile.bio || 'No description available',
    imageSrc:
      profile.imageURL ||
      profile.avatar_image?.s3Location ||
      '/assets/default-avatar.png',
    tags: [
      profile.occupation,
      profile.personality,
      ...profile.hobbies.slice(0, 1),
    ],
  }));
};

export const mapBotProfilesToEnhancedCompanions = (
  profiles: BotProfile[]
): EnhancedCompanion[] => {
  return profiles.map((profile) => ({
    id: profile._id,
    name: profile.name,
    age: parseInt(profile.age) || 20,
    description: profile.bio || 'No description available',
    imageSrc:
      profile.imageURL ||
      profile.avatar_image?.s3Location ||
      '/assets/default-avatar.png',
    tags: [
      profile.occupation,
      profile.personality,
      ...profile.hobbies.slice(0, 1),
    ],
  }));
};

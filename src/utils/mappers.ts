import { BotProfile as ChatBotProfile } from '@/redux/services/chatApi';
import { BotProfile, CollectionImage } from '@/redux/services/botProfilesApi';
import { Companion } from '@/components/cards/CompanionCard';
import { Companion as EnhancedCompanion } from '@/components/cards/EnhancedCompanionCard';
import { ChatListItem, Chat, ChatUser } from '@/types/chat';
import { CollectionCharacter, CharacterImage } from '@/types/collection';

export const mapBotProfilesToCompanions = (
  profiles: BotProfile[],
  likedBotIds?: string[],
): Companion[] => {
  return profiles.map(profile => {
    // Prioritize isLiked from API response, then check likedBotIds array
    let isLiked = false;
    if (profile.isLiked !== undefined) {
      isLiked = profile.isLiked;
    } else if (likedBotIds && likedBotIds.length > 0) {
      isLiked = likedBotIds.includes(profile._id);
    }

    return {
      id: profile._id,
      name: profile.name,
      age: parseInt(profile.age) || 20,
      description: profile.bio || 'No description available',
      imageSrc:
        profile.imageURL || profile.avatar_image?.s3Location || '/assets/default-avatar.png',
      tags: [profile.occupation, profile.personality, ...profile.hobbies.slice(0, 1)],
      isLiked,
      imageType: profile.imageType as 'sfw' | 'nsfw',
      category: profile.category as 'sfw' | 'nsfw', // Add category for blur logic
    };
  });
};

export const mapBotProfilesToEnhancedCompanions = (
  profiles: BotProfile[],
  likedBotIds?: string[],
): EnhancedCompanion[] => {
  return profiles.map(profile => {
    // Prioritize isLiked from API response, then check likedBotIds array
    let isLiked = false;
    if (profile.isLiked !== undefined) {
      isLiked = profile.isLiked;
    } else if (likedBotIds && likedBotIds.length > 0) {
      isLiked = likedBotIds.includes(profile._id);
    }

    return {
      id: profile._id,
      name: profile.name,
      age: parseInt(profile.age) || 20,
      description: profile.bio || 'No description available',
      imageSrc:
        profile.imageURL || profile.avatar_image?.s3Location || '/assets/default-avatar.png',
      tags: [profile.occupation, profile.personality, ...profile.hobbies.slice(0, 1)],
      isLiked,
      imageType: profile.imageType as 'sfw' | 'nsfw',
      category: profile.category as 'sfw' | 'nsfw', // Add category for blur logic
    };
  });
};

// Chat List Mappers
export const mapChatListItemsToChats = (chatListItems: ChatListItem[]): Chat[] => {
  return chatListItems.map(item => {
    console.log('item', item);
    // Create a ChatUser object from the chat list item using botProfile data
    const chatUser: ChatUser = {
      id: item.botId,
      name: (item.botProfile as ChatBotProfile).name || item.botName,
      age: parseInt((item.botProfile as ChatBotProfile).age) || 25,
      avatar:
        (item.botProfile as ChatBotProfile).imageURL ||
        item.botImageURL ||
        '/assets/default-avatar.png',
      isOnline: false, // Default to offline
      stats: {
        messages: '0',
        chats: '1',
      },
      tags: [
        (item.botProfile as ChatBotProfile).occupation,
        (item.botProfile as ChatBotProfile).personality,
        ...(item.botProfile as ChatBotProfile).hobbies.slice(0, 1),
      ],
      description: (item.botProfile as ChatBotProfile).bio || 'AI Companion',
      details: {
        age: parseInt((item.botProfile as ChatBotProfile).age) || 25,
        occupation: (item.botProfile as ChatBotProfile).occupation,
        gender:
          (item.botProfile as ChatBotProfile).bot_type === 'girl'
            ? 'Female'
            : (item.botProfile as ChatBotProfile).bot_type === 'boy'
              ? 'Male'
              : 'Unknown',
        ethnicity: (item.botProfile as ChatBotProfile).ethnicity,
        bodyType: (item.botProfile as ChatBotProfile).body_type,
        relationship: (item.botProfile as ChatBotProfile).relationship,
        personality: (item.botProfile as ChatBotProfile).personality,
        hobby: (item.botProfile as ChatBotProfile).hobbies[0] || 'Chatting',
      },
    };

    return {
      id: item.chatId,
      user: chatUser,
      lastMessage: item.lastMessage,
      timestamp: item.lastMessageTime,
      unreadCount: item.unreadCount,
      messages: [], // Messages will be loaded separately
      channelName: item.channelName,
      generatedImages: item.generatedImages, // Include generated images data
    };
  });
};

// Collection Mappers
export const mapBotProfilesToCollectionCharacters = (
  botProfiles: BotProfile[],
): CollectionCharacter[] => {
  return botProfiles.map(profile => {
    // Map collection images to CharacterImage format
    const images: CharacterImage[] = [];

    // Add main profile image as first image
    if (profile.imageURL) {
      images.push({
        id: `${profile._id}-main`,
        url: profile.imageURL,
        alt: `${profile.name} - Main profile image`,
        imageType: profile.imageType as 'sfw' | 'nsfw',
      });
    }

    // Add collection images
    if (profile.collectionImages && profile.collectionImages.length > 0) {
      profile.collectionImages.forEach((collectionImage: CollectionImage, index: number) => {
        const imageUrl =
          collectionImage.imageURL || collectionImage.avatar_image?.s3Location || profile.imageURL;

        if (imageUrl) {
          images.push({
            id: `${profile._id}-collection-${index}`,
            url: imageUrl,
            imageType: collectionImage.imageType as 'sfw' | 'nsfw',
            alt: collectionImage.prompt
              ? `${profile.name} - ${collectionImage.prompt}`
              : `${profile.name} - Collection image ${index + 1}`,
          });
        }
      });
    }

    // Use main image URL or first collection image as mainImage
    const mainImage =
      profile.imageURL ||
      (profile.collectionImages && profile.collectionImages.length > 0
        ? profile.collectionImages[0].imageURL ||
          profile.collectionImages[0].avatar_image?.s3Location
        : '/assets/default-avatar.png') ||
      '/assets/default-avatar.png';

    return {
      id: profile._id,
      name: profile.name,
      age: parseInt(profile.age) || 20,
      images,
      mainImage,
      imageType: profile.imageType as 'sfw' | 'nsfw',
      category: profile.category as 'sfw' | 'nsfw', // Add category for blur logic
    };
  });
};

import { BotProfile } from '@/redux/services/botProfilesApi';
import { Companion } from '@/components/cards/CompanionCard';
import { Companion as EnhancedCompanion } from '@/components/cards/EnhancedCompanionCard';
import { ChatListItem, Chat, ChatUser } from '@/types/chat';

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

// Chat List Mappers
export const mapChatListItemsToChats = (
  chatListItems: ChatListItem[]
): Chat[] => {
  return chatListItems.map((item) => {
    // Create a ChatUser object from the chat list item
    const chatUser: ChatUser = {
      id: item.botId,
      name: item.botName,
      age: 25, // Default age since it's not provided in API
      avatar: item.botImageURL || '/assets/default-avatar.png',
      isOnline: false, // Default to offline
      stats: {
        messages: '0',
        chats: '1',
      },
      tags: ['AI Companion'],
      description: 'AI Companion',
      details: {
        age: 25,
        occupation: 'AI Companion',
        gender: 'Unknown',
        ethnicity: 'Unknown',
        bodyType: 'Unknown',
        relationship: 'Friend',
        personality: 'Friendly',
        hobby: 'Chatting',
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
    };
  });
};

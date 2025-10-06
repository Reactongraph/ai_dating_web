import { BotProfile } from '@/redux/services/chatApi';
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
    // Create a ChatUser object from the chat list item using botProfile data
    const chatUser: ChatUser = {
      id: item.botId,
      name: item.botProfile.name || item.botName,
      age: parseInt(item.botProfile.age) || 25,
      avatar:
        item.botProfile.imageURL ||
        item.botImageURL ||
        '/assets/default-avatar.png',
      isOnline: false, // Default to offline
      stats: {
        messages: '0',
        chats: '1',
      },
      tags: [
        item.botProfile.occupation,
        item.botProfile.personality,
        ...item.botProfile.hobbies.slice(0, 1),
      ],
      description: item.botProfile.bio || 'AI Companion',
      details: {
        age: parseInt(item.botProfile.age) || 25,
        occupation: item.botProfile.occupation,
        gender:
          item.botProfile.bot_type === 'girl'
            ? 'Female'
            : item.botProfile.bot_type === 'boy'
              ? 'Male'
              : 'Unknown',
        ethnicity: item.botProfile.ethnicity,
        bodyType: item.botProfile.body_type,
        relationship: item.botProfile.relationship,
        personality: item.botProfile.personality,
        hobby: item.botProfile.hobbies[0] || 'Chatting',
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

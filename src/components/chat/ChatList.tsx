import Image from 'next/image';
import { Chat } from '@/types/chat';

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onChatSelect,
}) => {
  if (chats.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-white text-xl font-semibold mb-2">
            List is Empty
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Customize your character and start a smart, fun
            <br />
            conversation in seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`flex items-center p-4 cursor-pointer hover:bg-gray-800/50 transition-colors ${
            selectedChatId === chat.id ? 'bg-gray-800' : ''
          }`}
          onClick={() => onChatSelect(chat.id)}
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={chat.user.avatar}
                alt={chat.user.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            {chat.user.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            )}
          </div>

          {/* Chat Info */}
          <div className="flex-1 ml-3 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium truncate">
                {chat.user.name}
              </h4>
              <span className="text-gray-400 text-sm">{chat.timestamp}</span>
            </div>
            <p className="text-gray-400 text-sm truncate mt-1">
              {chat.lastMessage}
            </p>
          </div>

          {/* Unread Count */}
          {chat.unreadCount && chat.unreadCount > 0 && (
            <div className="ml-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {chat.unreadCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;

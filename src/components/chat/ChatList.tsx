'use client';

import Image from 'next/image';
import { Chat } from '@/types/chat';
import { formatChatTime } from '@/utils/dateUtils';

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  isAuthenticated?: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onChatSelect,
  isLoading = false,
  error,
  onRetry,
  hasNextPage = false,
  onLoadMore,
  isAuthenticated = false,
}) => {
  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-white text-xl font-semibold mb-2">
            Please Login
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            You need to be logged in to view your chats.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && chats.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        {[...Array(5)].map((_, index) => (
          <div key={`loading-${index}`} className="flex items-center p-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="flex-1 ml-3">
              <div className="h-4 bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-red-400 text-xl font-semibold mb-2">
            Failed to Load Chats
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            There was an error loading your chats. Please try again.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
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
              <h4 className="text-white font-medium truncate text-sm">
                {chat.user.name}
              </h4>
              <span className="text-gray-400 text-xs">
                {formatChatTime(chat.timestamp)}
              </span>
            </div>
            <p className="text-gray-400 text-xs truncate mt-1">
              {chat.lastMessage}
            </p>
          </div>

          {/* Unread Count */}
          {/* {chat.unreadCount && chat.unreadCount > 0 && (
            <div className="ml-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {chat.unreadCount}
            </div>
          )} */}
        </div>
      ))}

      {/* Load More Button */}
      {hasNextPage && onLoadMore && (
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {isLoading && chats.length > 0 && (
        <div className="p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
            <span className="ml-2 text-gray-400 text-sm">
              Loading more chats...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;

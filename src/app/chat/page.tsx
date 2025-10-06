'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { privacyMessage } from '@/data/chat';
import { Chat } from '@/types/chat';
import ChatList from '@/components/chat/ChatList';
import ChatArea from '@/components/chat/ChatArea';
import ProfilePanel from '@/components/chat/ProfilePanel';
import { useGetChatListQuery } from '@/redux/services/chatApi';
import { mapChatListItemsToChats } from '@/utils/mappers';
import { useAppSelector } from '@/redux/hooks';

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const searchParams = useSearchParams();

  // Check if user is authenticated
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Fetch chat list from API
  const {
    data: chatListResponse,
    isLoading,
    error,
    refetch,
  } = useGetChatListQuery(
    { page: currentPage, limit },
    {
      skip: !isAuthenticated, // Skip the query if user is not authenticated
    }
  );

  // Transform API data to component format
  const chats: Chat[] = chatListResponse?.data?.chats
    ? mapChatListItemsToChats(chatListResponse.data.chats)
    : [];

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  // Handle chatId from URL parameters
  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chatId');
    if (chatIdFromUrl) {
      setSelectedChatId(chatIdFromUrl);
    }
  }, [searchParams]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  // Message handlers are now handled by the ChatArea component via useChat hook

  const handleLoadMore = () => {
    if (chatListResponse?.data?.pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleRetry = () => {
    refetch();
  };
  return (
    <div className="h-[calc(100vh-64px)] bg-black flex overflow-hidden ">
      {/* Chat Sidebar */}
      <div className="w-80 bg-black border-r border-gray-800 flex flex-col flex-shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800 flex-shrink-0">
          <h1 className="text-3xl font-bold text-white mb-6">Chats</h1>

          {/* Chat Tabs */}
          <div className="flex">
            <button className="text-white text-lg font-medium pb-2 border-b-2 border-white">
              All Chats
            </button>
          </div>
        </div>

        {/* Chat List */}
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId || undefined}
          onChatSelect={handleChatSelect}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          hasNextPage={chatListResponse?.data?.pagination.hasNextPage}
          onLoadMore={handleLoadMore}
          isAuthenticated={isAuthenticated}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0">
        <ChatArea chat={selectedChat} privacyMessage={privacyMessage} />
      </div>

      {/* Profile Panel - Always Visible */}
      <div className="flex-shrink-0">
        <ProfilePanel
          user={selectedChat?.user || null}
          generatedImages={selectedChat?.generatedImages?.images || []}
        />
      </div>
    </div>
  );
}

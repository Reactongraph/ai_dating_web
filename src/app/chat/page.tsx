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
  const [activeTab, setActiveTab] = useState<'chat' | 'profile'>('chat');
  const [screenSize, setScreenSize] = useState<'sm' | 'lg' | 'xl'>('lg');
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

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setScreenSize('sm'); // Mobile and tablet
      } else if (width >= 1024 && width < 1280) {
        setScreenSize('lg'); // Large screens (show only chat list)
      } else {
        setScreenSize('xl'); // Extra large screens (show all components)
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to chat tab when selecting a new chat
  useEffect(() => {
    if (selectedChatId) {
      setActiveTab('chat');
    }
  }, [selectedChatId]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleLoadMore = () => {
    if (chatListResponse?.data?.pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  // Handle back to chat list
  const handleBackToList = () => {
    setSelectedChatId(null);
  };

  // Determine if we should show only the chat list (no chat selected or lg screen)
  const showOnlyChatList =
    (screenSize !== 'xl' && !selectedChatId) ||
    (screenSize === 'lg' && !selectedChatId);

  // Determine if we should show the chat area based on screen size and selection
  const showChatArea =
    (screenSize === 'sm' && selectedChatId && activeTab === 'chat') ||
    (screenSize === 'lg' && selectedChatId) ||
    screenSize === 'xl';

  return (
    <div className="h-[calc(100vh-64px)] bg-black flex overflow-hidden">
      {/* Chat Sidebar */}
      <div
        className={`bg-black border-r border-gray-800 flex flex-col flex-shrink-0 transition-all duration-300
          ${(screenSize === 'sm' || screenSize === 'lg') && selectedChatId ? 'hidden' : 'block'}
          ${screenSize === 'xl' ? 'w-80' : screenSize === 'sm' || showOnlyChatList ? 'w-full' : 'w-80'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-gray-800 flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
            Chats
          </h1>

          {/* Chat Tabs */}
          <div className="flex">
            <button className="text-white text-base md:text-lg font-medium pb-2 border-b-2 border-white">
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

      {/* Main Content Area */}
      {(screenSize === 'sm' && selectedChatId) ||
      (screenSize === 'lg' && selectedChatId) ||
      screenSize === 'xl' ? (
        <div
          className={`flex-1 min-w-0 flex flex-col ${screenSize === 'sm' ? 'w-full' : ''}`}
        >
          {/* Mobile Tab Navigation */}
          {screenSize === 'sm' && selectedChatId && (
            <div className="bg-gray-900 border-b border-gray-800">
              <div className="flex items-center p-2">
                <button
                  onClick={handleBackToList}
                  className="text-gray-400 hover:text-white p-2 mr-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex flex-1 justify-center">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'chat'
                        ? 'text-white border-b-2 border-white'
                        : 'text-gray-400'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'profile'
                        ? 'text-white border-b-2 border-white'
                        : 'text-gray-400'
                    }`}
                  >
                    Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Area */}
          {showChatArea && (
            <div className="flex-1 min-w-0">
              <ChatArea chat={selectedChat} privacyMessage={privacyMessage} />
            </div>
          )}

          {/* Mobile Profile Panel */}
          {screenSize === 'sm' && selectedChatId && activeTab === 'profile' && (
            <div className="flex-1 overflow-y-auto">
              <ProfilePanel
                user={selectedChat?.user || null}
                generatedImages={selectedChat?.generatedImages?.images || []}
              />
            </div>
          )}
        </div>
      ) : null}

      {/* Desktop Profile Panel - Visible on lg and xl screens when chat is selected */}
      {(screenSize === 'xl' || (screenSize === 'lg' && selectedChatId)) && (
        <div className="flex-shrink-0 w-80">
          <ProfilePanel
            user={selectedChat?.user || null}
            generatedImages={selectedChat?.generatedImages?.images || []}
          />
        </div>
      )}
    </div>
  );
}

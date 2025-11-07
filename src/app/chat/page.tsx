'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
      skip: !isAuthenticated,
    }
  );

  // Memoize chats array to avoid recreating on every render
  const chats: Chat[] = useMemo(
    () =>
      chatListResponse?.data?.chats
    ? mapChatListItemsToChats(chatListResponse.data.chats)
        : [],
    [chatListResponse?.data?.chats]
  );

  // Memoize selected chat to avoid recalculation
  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) || null,
    [chats, selectedChatId]
  );

  // Handle chatId from URL parameters
  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chatId');
    if (chatIdFromUrl) {
      setSelectedChatId(chatIdFromUrl);
    }
  }, [searchParams]);

  // Responsive screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setScreenSize('sm');
      } else if (width >= 1024 && width < 1280) {
        setScreenSize('lg');
      } else {
        setScreenSize('xl');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedChatId) setActiveTab('chat');
  }, [selectedChatId]);

  // Memoize handlers to prevent recreation on every render
  const handleChatSelect = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (chatListResponse?.data?.pagination.hasNextPage) {
      setCurrentPage((p) => p + 1);
    }
  }, [chatListResponse?.data?.pagination.hasNextPage]);

  const handleRetry = useCallback(() => refetch(), [refetch]);
  
  const handleBackToList = useCallback(() => setSelectedChatId(null), []);

  // Memoize computed values
  const showOnlyChatList = useMemo(
    () =>
    (screenSize !== 'xl' && !selectedChatId) ||
      (screenSize === 'lg' && !selectedChatId),
    [screenSize, selectedChatId]
  );

  const showChatArea = useMemo(
    () =>
    (screenSize === 'sm' && selectedChatId && activeTab === 'chat') ||
    (screenSize === 'lg' && selectedChatId) ||
      screenSize === 'xl',
    [screenSize, selectedChatId, activeTab]
  );

  return (
    // Outer wrapper: full available height (you used calc(100vh-64px) previously)
    <div className="h-[calc(100vh-64px)] bg-black flex flex-col overflow-hidden">
      {/* MAIN ROW */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR (Chat List) */}
        <div
          className={`
            bg-black border-r border-gray-800 flex flex-col flex-shrink-0 transition-all duration-300
            ${(screenSize === 'sm' || screenSize === 'lg') && selectedChatId ? 'hidden' : 'flex'}
            ${screenSize === 'xl' ? 'w-80' : screenSize === 'sm' || showOnlyChatList ? 'w-full' : 'w-80'}
          `}
        >
          {/* Sidebar Header (fixed) */}
          <div className="p-4 md:p-6 border-b border-gray-800 shrink-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
              Chats
            </h1>

            <div className="flex">
              <button className="text-white text-base md:text-lg font-medium pb-2 border-b-2 border-white">
                All Chats
              </button>
            </div>
          </div>

          {/* Chat List body - scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto">
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
        </div>

        {/* MIDDLE PANEL (Chat Area) */}
        {(screenSize === 'sm' && selectedChatId) ||
        (screenSize === 'lg' && selectedChatId) ||
        screenSize === 'xl' ? (
          <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
            {/* Mobile top navigation (only on small screens) */}
            {screenSize === 'sm' && selectedChatId && (
              <div className="bg-gray-900 border-b border-gray-800 shrink-0">
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

            {/* ChatArea (fills available height) */}
            {showChatArea && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <ChatArea chat={selectedChat} privacyMessage={privacyMessage} />
              </div>
            )}

            {/* Mobile profile tab */}
            {screenSize === 'sm' &&
              selectedChatId &&
              activeTab === 'profile' && (
                <div className="flex-1 min-w-0 overflow-y-auto">
                  <ProfilePanel
                    user={selectedChat?.user || null}
                    generatedImages={
                      selectedChat?.generatedImages?.images || []
                    }
                    onRefetchImages={refetch}
                  />
                </div>
              )}
          </div>
        ) : null}

        {/* RIGHT PROFILE PANEL (desktop/tablet) */}
        {(screenSize === 'xl' || (screenSize === 'lg' && selectedChatId)) && (
          <div className="flex-shrink-0 w-80 min-h-0 overflow-y-auto border-l border-gray-800">
            <ProfilePanel
              user={selectedChat?.user || null}
              generatedImages={selectedChat?.generatedImages?.images || []}
              onRefetchImages={refetch}
            />
          </div>
        )}
      </div>
    </div>
  );
}

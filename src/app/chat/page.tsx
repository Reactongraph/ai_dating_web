'use client';

import { useState } from 'react';
import { mockChats, quickSuggestions, privacyMessage } from '@/data/chat';
import { Chat } from '@/types/chat';
import ChatList from '@/components/chat/ChatList';
import ChatArea from '@/components/chat/ChatArea';
import ProfilePanel from '@/components/chat/ProfilePanel';

export default function ChatPage() {
  const [chats] = useState<Chat[]>(mockChats); // In real app, this would come from API
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // TODO: Integrate with API to send message
    // This would typically:
    // 1. Add the user message to the chat
    // 2. Send to API
    // 3. Receive and display AI response
  };

  const handleQuickSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
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
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0">
        <ChatArea
          chat={selectedChat}
          quickSuggestions={quickSuggestions}
          privacyMessage={privacyMessage}
          onSendMessage={handleSendMessage}
          onQuickSuggestionClick={handleQuickSuggestionClick}
        />
      </div>

      {/* Profile Panel - Always Visible */}
      <div className="flex-shrink-0">
        <ProfilePanel user={selectedChat?.user || null} />
      </div>
    </div>
  );
}

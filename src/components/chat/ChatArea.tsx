'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Chat } from '@/types/chat';
import { useChat } from '@/hooks/useChat';
import {
  useGetChatSuggestionsQuery,
  SuggestionContext,
} from '@/redux/services/chatApi';

interface ChatAreaProps {
  chat: Chat | null;
  privacyMessage: string;
  onQuickSuggestionClick?: (suggestion: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  privacyMessage,
  onQuickSuggestionClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestionContext, setSuggestionContext] =
    useState<SuggestionContext>('greeting');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Use chat hook for API integration
  const {
    messages,
    isLoadingHistory,
    isSendingMessage,
    isTyping,
    sendMessage,
    historyError,
  } = useChat({
    chatId: chat?.id,
    botId: chat?.user.id,
    channelName: chat?.channelName,
  });

  // Get suggestions based on context
  const { data: suggestionsData, isLoading: isLoadingSuggestions } =
    useGetChatSuggestionsQuery(
      {
        botId: chat?.user.id || '',
        context: suggestionContext,
      },
      {
        skip: !chat?.user.id,
      }
    );

  // Auto-scroll to bottom when new messages arrive or typing starts/stops
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Use API sendMessage if no custom handler provided
  const handleSendMessage = sendMessage;
  const handleQuickSuggestionClick = onQuickSuggestionClick || sendMessage;
  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black">
        <div className="text-center max-w-md">
          {/* Chat Icons */}
          <div className="mb-8 relative">
            {/* Background Chat Bubble */}
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Foreground Chat Bubble */}
            <div className="absolute top-6 right-1/2 transform translate-x-8 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Empty State Content */}
          <h2 className="text-3xl font-bold text-white mb-4">
            No Chats Yet? Let&apos;s Get Started
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Personalize your AI character and dive into smart, fun conversations
            <br />— your companion is just a click away.
          </p>
        </div>
      </div>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    if (input.value.trim()) {
      handleSendMessage(input.value.trim());
      input.value = '';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-800 flex-shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={chat.user.avatar}
              alt={chat.user.name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          {chat.user.isLimitedEdition && (
            <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-1 rounded text-[10px] font-bold">
              LIMITED EDITION
            </div>
          )}
        </div>
        <div className="ml-3">
          <h3 className="text-white font-medium">{chat.user.name}</h3>
          {chat.user.isLimitedEdition && (
            <span className="text-yellow-400 text-xs">LIMITED EDITION</span>
          )}
        </div>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col">
        {/* Character Card - Smaller Size */}
        <div className="flex items-center justify-center">
          <div className="w-64 flex items-center flex-col">
            <div className="relative mb-1">
              <div className="w-32 h-32 rounded-xl overflow-hidden">
                <Image
                  src={chat.user.avatar}
                  alt={chat.user.name}
                  width={120}
                  height={120}
                  className="object-cover w-full h-full"
                />
              </div>
              {chat.user.isLimitedEdition && (
                <div className="absolute top-1 left-1 bg-white/90 text-black text-xs px-1.5 py-0.5 rounded text-[10px] font-bold">
                  LIMITED EDITION
                </div>
              )}
            </div>

            <h4 className="text-white font-bold text-sm text-center mb-2">
              {chat.user.name}, {chat.user.age}
            </h4>

            {/* <div className="flex justify-center space-x-4 text-center mb-2">
              <div>
                <div className="text-white font-bold text-sm">
                  {chat.user.stats.messages}
                </div>
                <div className="text-gray-400 text-xs">messages</div>
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  {chat.user.stats.chats}
                </div>
                <div className="text-gray-400 text-xs">chats</div>
              </div>
            </div> */}

            {/* <div className="flex justify-center space-x-1 mb-2">
              {chat.user.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-xs text-center leading-relaxed">
              {chat.user.description}
            </p> */}
          </div>
        </div>

        {/* Privacy Message */}
        <div className="text-center mb-2">
          <p className="text-gray-500 text-xs">Today</p>
          <p className="text-gray-400 text-xs mt-1 max-w-md mx-auto">
            {privacyMessage}
          </p>
        </div>

        {/* Loading State */}
        {isLoadingHistory && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Error State */}
        {historyError && (
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <p className="text-red-400 text-sm mb-2">
                Failed to load chat history
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-800 text-white'
                }`}
              >
                {message.type === 'IMAGE' ? (
                  <div className="space-y-2">
                    <div
                      className="relative w-48 h-48 cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => setFullscreenImage(message.content)}
                    >
                      <Image
                        src={message.content}
                        alt="Generated image"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-white max-w-xs p-3 rounded-2xl">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-300">
                    {chat.user.name} is typing
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        {/* Quick Suggestions */}
        <div className="mb-4">
          {/* Context Selector */}
          <div className="flex items-center gap-2 mb-3">
            <p className="text-gray-400 text-sm">Suggestions:</p>
            <div className="flex gap-1">
              <button
                onClick={() => setSuggestionContext('greeting')}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  suggestionContext === 'greeting'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Greetings
              </button>
              <button
                onClick={() => setSuggestionContext('casual')}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  suggestionContext === 'casual'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Casual
              </button>
              <button
                onClick={() => setSuggestionContext('flirty')}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  suggestionContext === 'flirty'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Flirty
              </button>
            </div>
          </div>

          {/* Suggestions List - Horizontally Scrollable */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 min-w-min">
              {isLoadingSuggestions ? (
                <div className="text-gray-400 text-sm whitespace-nowrap">
                  Loading suggestions...
                </div>
              ) : suggestionsData?.data.suggestions ? (
                suggestionsData.data.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestionClick(suggestion)}
                    className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {suggestion}
                  </button>
                ))
              ) : (
                <div className="text-gray-400 text-sm whitespace-nowrap">
                  No suggestions available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center space-x-2"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type here to generate image..."
              className="w-full bg-gray-800 text-white rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={isSendingMessage}
            className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Full-screen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setFullscreenImage(null)}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={fullscreenImage}
              alt="Full-screen view"
              width={1200}
              height={800}
              className="object-contain max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;

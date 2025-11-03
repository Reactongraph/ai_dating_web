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
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [clickedSuggestion, setClickedSuggestion] = useState<
    string | undefined
  >();

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

  // Track if initial load is complete
  const initialLoadDoneRef = useRef<boolean>(false);
  // Track the clicked suggestion for API call
  const pendingClickedSuggestionRef = useRef<string | undefined>(undefined);
  // State to control when to fetch suggestions
  const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(false);

  const { data: suggestionsData, isLoading: isLoadingSuggestions } =
    useGetChatSuggestionsQuery(
      {
        botId: chat?.user.id || '',
        chatId: chat?.id,
        context: suggestionContext,
        clickedSuggestion: pendingClickedSuggestionRef.current,
        currentSuggestions:
          pendingClickedSuggestionRef.current && currentSuggestions.length > 0
            ? currentSuggestions
            : undefined,
      },
      {
        // Only skip when we don't have chat ID or when we don't want to fetch
        skip: !chat?.user.id || !shouldFetchSuggestions,
        // Disable automatic refetching
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false,
        pollingInterval: 0,
      }
    );

  useEffect(() => {
    // smooth scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initial load - trigger fetch when chat is available
  useEffect(() => {
    if (chat?.user.id && !initialLoadDoneRef.current) {
      // Clear any pending clicked suggestion for initial load
      pendingClickedSuggestionRef.current = undefined;
      // Enable fetching to trigger the query
      setShouldFetchSuggestions(true);
      initialLoadDoneRef.current = true;
    }
  }, [chat?.user.id]);

  // Handle context change - fetch new suggestions for new context
  const previousContextRef = useRef<SuggestionContext>(suggestionContext);
  useEffect(() => {
    if (
      chat?.user.id &&
      initialLoadDoneRef.current &&
      suggestionContext !== previousContextRef.current
    ) {
      previousContextRef.current = suggestionContext;
      // Clear clicked suggestion for context change
      pendingClickedSuggestionRef.current = undefined;
      // Trigger fetch by toggling the state
      setShouldFetchSuggestions(false);
      setTimeout(() => setShouldFetchSuggestions(true), 0);
    }
  }, [chat?.user.id, suggestionContext]);

  // Handle clicked suggestion - fetch new suggestion to replace clicked one
  useEffect(() => {
    if (
      clickedSuggestion &&
      initialLoadDoneRef.current &&
      clickedSuggestion !== pendingClickedSuggestionRef.current
    ) {
      // Set the clicked suggestion for the API call
      pendingClickedSuggestionRef.current = clickedSuggestion;
      // Trigger fetch by toggling the state
      setShouldFetchSuggestions(false);
      setTimeout(() => setShouldFetchSuggestions(true), 0);
    }
  }, [clickedSuggestion]);

  // We no longer need this effect as the initial query runs automatically
  // The query will run when the component mounts if chat?.user.id is available

  // Update current suggestions when API response changes
  useEffect(() => {
    if (suggestionsData?.data?.suggestions) {
      // Update suggestions with new data
      setCurrentSuggestions(suggestionsData.data.suggestions);

      // Clear the pending clicked suggestion after processing
      pendingClickedSuggestionRef.current = undefined;

      // Reset clicked suggestion state (used only to trigger the effect)
      setClickedSuggestion(undefined);

      // Turn off fetching after receiving data to prevent continuous calls
      setShouldFetchSuggestions(false);
    }
  }, [suggestionsData]);

  const handleSendMessage = sendMessage;

  // Enhanced suggestion click handler that both sends the message and triggers a refresh
  const handleQuickSuggestionClick = (suggestion: string) => {
    // Send the message
    if (onQuickSuggestionClick) {
      onQuickSuggestionClick(suggestion);
    } else {
      sendMessage(suggestion);
    }

    // Only trigger if we're not already processing this suggestion
    if (clickedSuggestion !== suggestion) {
      // Set the clicked suggestion to trigger the refetch effect
      setClickedSuggestion(suggestion);
    }
  };

  if (!chat) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black">
        <div className="text-center max-w-md">
          <div className="mb-8 relative">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            <div className="absolute top-6 right-1/2 transform translate-x-8 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
          </div>

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
    if (input?.value?.trim()) {
      handleSendMessage(input.value.trim());
      input.value = '';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header - fixed */}
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

      {/* Main chat wrapper - ensures only messages area scrolls */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Character card & privacy - fixed (non-scrolling) */}

        {/* Messages area - THIS is the only scrollable area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 min-h-0">
          <div className="p-3 shrink-0 border-b border-gray-800">
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
              </div>
            </div>

            <div className="text-center mb-2">
              <p className="text-gray-500 text-xs">Today</p>
              <p className="text-gray-400 text-xs mt-1 max-w-md mx-auto">
                {privacyMessage}
              </p>
            </div>
          </div>
          {isLoadingHistory && (
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
            </div>
          )}

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
                  <>
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
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </>
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

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-white max-w-xs p-3 rounded-2xl">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-300">
                    {chat.user.name} is typing
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer / input - fixed */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-gray-400 text-sm">Suggestions:</p>
            <div className="flex gap-1">
              {(['greeting', 'casual', 'flirty'] as SuggestionContext[]).map(
                (ctx) => (
                  <button
                    key={ctx}
                    onClick={() => {
                      setSuggestionContext(ctx);
                      // Reset suggestions when changing context
                      setCurrentSuggestions([]);
                      // Clear any pending clicked suggestion when changing context
                      setClickedSuggestion(undefined);
                      // The effect will handle the refetch when context changes
                    }}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      suggestionContext === ctx
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {ctx.charAt(0).toUpperCase() + ctx.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 min-w-min">
              {isLoadingSuggestions ? (
                <div className="text-gray-400 text-sm whitespace-nowrap">
                  Loading suggestions...
                </div>
              ) : suggestionsData?.data.suggestions?.length ? (
                suggestionsData.data.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickSuggestionClick(suggestion)}
                    className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap"
                  >
                    {suggestion}
                  </button>
                ))
              ) : (
                <div className="text-gray-400 text-sm whitespace-nowrap">
                  No suggestions
                </div>
              )}
            </div>
          </div>
        </div>

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
          </div>
          <button
            type="submit"
            disabled={isSendingMessage}
            className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-full p-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Fullscreen image modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <Image
            src={fullscreenImage}
            alt="Full-screen view"
            width={1200}
            height={800}
            className="object-contain max-h-[90vh]"
          />
        </div>
      )}
    </div>
  );
};

export default ChatArea;

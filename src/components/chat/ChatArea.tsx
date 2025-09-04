import Image from 'next/image';
import { Chat, QuickSuggestion } from '@/types/chat';

interface ChatAreaProps {
  chat: Chat | null;
  quickSuggestions: QuickSuggestion[];
  privacyMessage: string;
  onSendMessage: (message: string) => void;
  onQuickSuggestionClick: (suggestion: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  quickSuggestions,
  privacyMessage,
  onSendMessage,
  onQuickSuggestionClick,
}) => {
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    if (input.value.trim()) {
      onSendMessage(input.value.trim());
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
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Character Card - Smaller Size */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-2xl p-3 w-64">
            <div className="relative mb-3">
              <div className="w-full h-40 rounded-xl overflow-hidden">
                <Image
                  src={chat.user.avatar}
                  alt={chat.user.name}
                  width={200}
                  height={160}
                  className="object-cover w-full h-full"
                />
              </div>
              {chat.user.isLimitedEdition && (
                <div className="absolute top-1 left-1 bg-white/90 text-black text-xs px-1.5 py-0.5 rounded text-[10px] font-bold">
                  LIMITED EDITION
                </div>
              )}
            </div>

            <h4 className="text-white font-bold text-base text-center mb-2">
              {chat.user.name}, {chat.user.age}
            </h4>

            <div className="flex justify-center space-x-4 text-center mb-2">
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
            </div>

            <div className="flex justify-center space-x-1 mb-2">
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
            </p>
          </div>
        </div>

        {/* Privacy Message */}
        <div className="text-center mb-4">
          <p className="text-gray-500 text-xs">Today</p>
          <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
            {privacyMessage}
          </p>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6">
          {chat.messages.map((message) => (
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
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        {/* Quick Suggestions */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => onQuickSuggestionClick(suggestion.text)}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-2 rounded-full transition-colors"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
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
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;

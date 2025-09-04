'use client';

export default function ChatPage() {
  return (
    <div className="h-screen bg-black flex">
      {/* Chat Sidebar */}
      <div className="w-80 bg-black border-r border-gray-800 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-3xl font-bold text-white mb-6">Chats</h1>

          {/* Chat Tabs */}
          <div className="flex">
            <button className="text-white text-lg font-medium pb-2 border-b-2 border-white">
              All Chats
            </button>
          </div>
        </div>

        {/* Chat List */}
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
      </div>

      {/* Main Chat Area */}
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
    </div>
  );
}

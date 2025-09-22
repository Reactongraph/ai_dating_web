import { useState, useEffect, useCallback } from 'react';
import {
  useChatWithBotMutation,
  useMarkMessagesAsReadMutation,
  useGetChatHistoryQuery,
  chatApi,
  ChatMessage,
  ChatWithBotRequest,
  ChatWithBotHistoryMessage,
  ChatHistoryMessage as ApiChatHistoryMessage,
} from '@/redux/services/chatApi';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSnackbar } from '@/providers';

interface UseChatProps {
  chatId?: string;
  botId?: string;
  channelName?: string;
}

export const useChat = ({ chatId, botId, channelName }: UseChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const { showSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const [chatWithBot] = useChatWithBotMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();

  // Fetch chat history when channelName is available
  const {
    data: chatHistoryResponse,
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useGetChatHistoryQuery(
    {
      channelName: channelName || '',
      page: 1,
      limit: 50,
      // Add chatId to force refetch when switching chats
      chatId: chatId || '',
    },
    {
      skip: !channelName, // Skip the query if no channelName
      refetchOnMountOrArgChange: true, // Always refetch when component mounts or args change
      refetchOnFocus: false, // Don't refetch on window focus
      refetchOnReconnect: false, // Don't refetch on network reconnect
    }
  );

  // Convert API chat history messages to internal format
  const convertApiMessagesToInternal = useCallback(
    (apiMessages: ApiChatHistoryMessage[]): ChatMessage[] => {
      return apiMessages.map((apiMsg) => ({
        id: apiMsg.chatId,
        senderId: apiMsg.senderId,
        content: apiMsg.message,
        timestamp: apiMsg.timestamp,
        isUser: apiMsg.messageType === 'USER',
        type: apiMsg.type,
      }));
    },
    []
  );

  // Convert messages to API format for chat-with-bot
  const convertMessagesToHistory = useCallback(
    (messages: ChatMessage[]): ChatWithBotHistoryMessage[] => {
      const history: ChatWithBotHistoryMessage[] = [];

      // Group messages by user and bot pairs
      let currentHumanMessage: string | null = null;

      for (const message of messages) {
        if (message.isUser) {
          // Store the human message
          currentHumanMessage = message.content;
        } else if (currentHumanMessage !== null) {
          // We have both human and bot messages, add to history
          history.push({
            human_message: currentHumanMessage,
            ai_message: message.content,
          });
          currentHumanMessage = null; // Reset for next pair
        }
      }

      return history;
    },
    []
  );

  // Function to refetch chat history
  const loadChatHistory = useCallback(() => {
    if (channelName) {
      refetchHistory();
    }
  }, [channelName, refetchHistory]);

  // Send a message
  const sendChatMessage = useCallback(
    async (messageContent: string) => {
      // console.log('sendChatMessage called with:', messageContent);
      // console.log('Current state:', {
      //   botId,
      //   userId: user?._id,
      //   messageContent,
      // });

      if (!botId || !user?._id || !messageContent.trim()) {
        // console.log('Missing required data:', {
        //   botId,
        //   userId: user?._id,
        //   messageContent,
        // });
        return;
      }

      // console.log('Sending message:', messageContent);
      // console.log('Bot ID:', botId);
      // console.log('User ID:', user._id);

      setIsSendingMessage(true);

      // Optimistically add user message
      const userMessage: ChatMessage = {
        id: `temp-user-${Date.now()}`,
        senderId: user._id,
        content: messageContent,
        timestamp: new Date().toISOString(),
        isUser: true,
        type: 'TEXT',
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Get current messages (excluding the just-added user message)
        const currentMessages = messages;
        const chatHistory = convertMessagesToHistory(currentMessages);

        // console.log('Chat history:', chatHistory);
        // console.log('Current messages before adding new:', currentMessages);

        const requestData: ChatWithBotRequest = {
          question: messageContent,
          chat_history: chatHistory,
          bot_profile_id: botId,
          user_id: user._id,
        };

        // console.log('Request data:', requestData);

        const response = await chatWithBot(requestData).unwrap();

        // console.log('API Response:', response);

        if (response.success && response.data.answer) {
          // Replace temporary user message with real one
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === userMessage.id
                ? {
                    ...msg,
                    id: `user-${Date.now()}`,
                  }
                : msg
            )
          );

          // Add bot response
          const botMessage: ChatMessage = {
            id: `bot-${Date.now()}`,
            senderId: botId,
            content: response.data.answer,
            timestamp: new Date().toISOString(),
            isUser: false,
            type: 'TEXT',
          };

          setMessages((prev) => [...prev, botMessage]);
          // console.log('Message sent successfully and bot response added');
        } else {
          throw new Error('Invalid response from bot');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Remove the optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
        showSnackbar('Failed to send message', 'error');
      } finally {
        setIsSendingMessage(false);
      }
    },
    [
      botId,
      user?._id,
      messages,
      convertMessagesToHistory,
      chatWithBot,
      showSnackbar,
    ]
  );

  // Mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    if (!channelName) return;

    try {
      await markAsRead(channelName).unwrap();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [channelName, markAsRead]);

  // Load chat history from API when response is available
  useEffect(() => {
    if (chatHistoryResponse?.success && chatHistoryResponse.data.messages) {
      // console.log(
      //   'Loading chat history from API:',
      //   chatHistoryResponse.data.messages
      // );
      const convertedMessages = convertApiMessagesToInternal(
        chatHistoryResponse.data.messages
      );
      setMessages(convertedMessages);
    }
  }, [chatHistoryResponse, convertApiMessagesToInternal]);

  // Clear messages and refetch history when chat changes
  useEffect(() => {
    if (chatId) {
      // console.log(
      //   'Chat changed, clearing messages and refetching history for:',
      //   chatId
      // );
      setMessages([]);

      // Invalidate all chat history cache to force fresh fetch
      dispatch(chatApi.util.invalidateTags(['ChatHistory']));

      // Refetch history for the new chat
      if (channelName) {
        refetchHistory();
      }
    }
  }, [chatId, channelName, refetchHistory, dispatch]);

  // Mark messages as read when chat is selected
  useEffect(() => {
    if (chatId && channelName) {
      markMessagesAsRead();
    }
  }, [chatId, channelName, markMessagesAsRead]);

  // Test function to check if API is working
  const testApiConnection = useCallback(async () => {
    if (!botId || !user?._id) {
      // console.log('Cannot test API - missing botId or userId');
      return;
    }

    try {
      const testRequest: ChatWithBotRequest = {
        question: 'Hello',
        chat_history: [],
        bot_profile_id: botId,
        user_id: user?._id || '',
      };

      await chatWithBot(testRequest).unwrap();
    } catch (error) {
      console.error('API test failed:', error);
      console.error('Error details:', error);
    }
  }, [botId, user?._id, chatWithBot]);

  // Make testApiConnection available globally for debugging
  if (typeof window !== 'undefined') {
    (
      window as unknown as { testChatApi: typeof testApiConnection }
    ).testChatApi = testApiConnection;
  }

  return {
    messages,
    isLoadingHistory,
    isSendingMessage,
    sendMessage: sendChatMessage,
    loadChatHistory,
    markMessagesAsRead,
    testApiConnection,
    historyError,
  };
};

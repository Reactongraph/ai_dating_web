import { useState, useEffect, useCallback, useRef } from 'react';
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
import { selectContentMode } from '@/redux/slices/contentModeSlice';
import { useSnackbar } from '@/providers';
import { useRouter } from 'next/navigation';

interface UseChatProps {
  chatId?: string;
  botId?: string;
  channelName?: string;
}

export const useChat = ({ chatId, botId, channelName }: UseChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  const isProcessingRef = useRef(false);

  const [chatWithBot] = useChatWithBotMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();

  const user = useAppSelector(state => state.auth.user);
  const contentMode = useAppSelector(selectContentMode); // Get contentMode from navbar
  const { showSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Update ref whenever messages change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
    },
  );

  // Helper function to deduplicate messages based on unique IDs and content similarity
  const deduplicateMessages = useCallback((messages: ChatMessage[]): ChatMessage[] => {
    const seenIds = new Set<string>();
    const seenContentKeys = new Map<string, number>();
    const result: ChatMessage[] = [];

    for (const msg of messages) {
      if (seenIds.has(msg.id)) {
        continue;
      }

      const contentKey = `${msg.senderId}-${msg.isUser}-${msg.type}-${msg.content}`;
      const timestamp = new Date(msg.timestamp).getTime();
      const lastTimestamp = seenContentKeys.get(contentKey);

      // Treat messages with identical content from the same sender within 60 seconds as duplicates
      if (lastTimestamp !== undefined && Math.abs(timestamp - lastTimestamp) < 60000) {
        continue;
      }

      seenIds.add(msg.id);
      seenContentKeys.set(contentKey, timestamp);
      result.push(msg);
    }

    return result;
  }, []);

  const isOptimisticMessage = useCallback((message: ChatMessage) => {
    return (
      message.id.startsWith('temp-') ||
      message.id.startsWith('user-') ||
      message.id.startsWith('bot-text-') ||
      message.id.startsWith('bot-image-')
    );
  }, []);

  const hasMatchingHistoryMessage = useCallback(
    (history: ChatMessage[], optimisticMessage: ChatMessage) => {
      const targetContent = optimisticMessage.content?.trim() || '';
      const targetTimestamp = new Date(optimisticMessage.timestamp).getTime();

      return history.some(histMsg => {
        if (histMsg.isUser !== optimisticMessage.isUser) return false;
        if (histMsg.type !== optimisticMessage.type) return false;
        if ((histMsg.content?.trim() || '') !== targetContent) return false;

        const histTimestamp = new Date(histMsg.timestamp).getTime();
        return Math.abs(histTimestamp - targetTimestamp) < 60000; // 60 second window
      });
    },
    [],
  );

  // Convert API chat history messages to internal format
  const convertApiMessagesToInternal = useCallback(
    (apiMessages: ApiChatHistoryMessage[]): ChatMessage[] => {
      // Create a copy and reverse it so newest messages appear at the bottom
      return [...apiMessages].reverse().flatMap(apiMsg => {
        const uniqueSuffix = `${apiMsg.timestamp}-${apiMsg.messageType}-${apiMsg.type}`;
        const baseMessage = {
          id: `${apiMsg.chatId}-${uniqueSuffix}`,
          senderId: apiMsg.senderId,
          timestamp: apiMsg.timestamp,
          isUser: apiMsg.messageType === 'USER',
        };

        if (apiMsg.type === 'TEXTANDIMAGE' && apiMsg.metadata?.imageUrl) {
          // For TEXTANDIMAGE, create two messages: one for text and one for image
          return [
            // {
            //   ...baseMessage,
            //   id: `${apiMsg.chatId}-text-${uniqueSuffix}`,
            //   content: apiMsg.message,
            //   type: 'TEXT',
            // },
            {
              ...baseMessage,
              id: `${apiMsg.chatId}-image-${uniqueSuffix}`,
              content: apiMsg.metadata.imageUrl,
              type: 'IMAGE',
            },
          ];
        }

        // For other types, return a single message
        return [
          {
            ...baseMessage,
            content: apiMsg.message,
            type: apiMsg.type,
          },
        ];
      });
    },
    [],
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
    [],
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
      // Prevent multiple simultaneous calls
      if (isProcessingRef.current) {
        console.warn('Already processing a message, ignoring duplicate call');
        return;
      }

      // console.log('sendChatMessage called with:', messageContent);
      // console.log('Current state:', {
      //   botId,
      //   userId: user?.id,
      //   messageContent,
      // });

      if (!botId || !user?.id || !messageContent.trim()) {
        // console.log('Missing required data:', {
        //   botId,
        //   userId: user?.id,
        //   messageContent,
        // });
        return;
      }

      isProcessingRef.current = true;
      setIsSendingMessage(true);

      // Optimistically add user message
      const userMessage: ChatMessage = {
        id: `temp-user-${Date.now()}`,
        senderId: user.id as string,
        content: messageContent,
        timestamp: new Date().toISOString(),
        isUser: true,
        type: 'TEXT',
      };

      // Get current messages before adding the user message
      const currentMessages = messagesRef.current;

      setMessages(prev => deduplicateMessages([...prev, userMessage]));

      // Show typing indicator immediately
      setIsTyping(true);

      try {
        // Use the messages we got before adding the user message
        const chatHistory = convertMessagesToHistory(currentMessages);

        // console.log('Chat history:', chatHistory);
        // console.log('Current messages before adding new:', currentMessages);

        const requestData: ChatWithBotRequest = {
          question: messageContent,
          chat_history: chatHistory,
          bot_profile_id: botId,
          user_id: user.id as string,
          category: contentMode, // Use contentMode from navbar (nsfw/sfw)
        };

        console.log('Request chat with bot data:', requestData);

        // Start API call and minimum delay in parallel
        const [response] = await Promise.all([
          chatWithBot(requestData).unwrap(),
          new Promise(resolve => setTimeout(resolve, 2000)), // Minimum 2 second delay
        ]);

        // console.log('API Response:', response);

        if (response.success && (response.data.answer || response.data.image)) {
          // Replace temporary user message with real one
          setMessages(prev =>
            deduplicateMessages(
              prev.map(msg =>
                msg.id === userMessage.id
                  ? {
                      ...msg,
                      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    }
                  : msg,
              ),
            ),
          );

          // Add additional random delay (0-2 seconds) for more natural feel
          const additionalDelay = Math.random() * 2000; // 0-2 seconds
          await new Promise(resolve => setTimeout(resolve, additionalDelay));

          // Create unique IDs for bot messages to prevent duplicates
          const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          const newMessages: ChatMessage[] = [];

          // Add text response if present
          if (response.data.answer) {
            newMessages.push({
              id: `bot-text-${uniqueId}`,
              senderId: botId,
              content: response.data.answer,
              timestamp: new Date().toISOString(),
              isUser: false,
              type: 'TEXT',
            });
          }

          // Add image response if present
          if (response.data.image) {
            // Use image ID from response if available, otherwise create unique ID
            const imageId = response.data.image.id
              ? `bot-image-${response.data.image.id}`
              : `bot-image-${uniqueId}-img`;

            // Check if this image message already exists to prevent duplicates
            const existingImageId = messagesRef.current.find(
              msg => msg.type === 'IMAGE' && msg.content === response.data.image.imageURL,
            )?.id;

            if (!existingImageId) {
              newMessages.push({
                id: imageId,
                senderId: botId,
                content: response.data.image.imageURL,
                timestamp: new Date().toISOString(),
                isUser: false,
                type: 'IMAGE',
              });
              // Invalidate ChatList cache to refresh generated images
              dispatch(chatApi.util.invalidateTags(['ChatList']));
            }
          }

          // Only add messages that don't already exist (by ID)
          setMessages(prev => {
            const existingIds = new Set(prev.map(msg => msg.id));
            const messagesToAdd = newMessages.filter(msg => !existingIds.has(msg.id));
            return deduplicateMessages([...prev, ...messagesToAdd]);
          });
          setIsTyping(false);
          // console.log('Message sent successfully and bot response added');
        } else {
          throw new Error('Invalid response from bot');
        }
      } catch (error: any) {
        console.error('Error sending message:', error);
        // Remove the optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        setIsTyping(false);

        // Handle specific error codes
        if (error?.status === 402 || error?.data?.statusCode === 402) {
          // Check if user is premium - if so, navigate to wallet, else show subscription modal
          const isPremiumUser = user?.subscriber?.isPremiumSubscriber || user?.isPremiumSubscriber;

          if (isPremiumUser) {
            // Premium user - navigate to wallet to add credits
            router.push('/wallet');
            showSnackbar('Insufficient credits. Please add more credits to continue.', 'info');
          } else {
            // Free user - show modal to subscribe
            setShowCreditsModal(true);
          }
        } else {
          showSnackbar('Failed to send message', 'error');
        }
      } finally {
        setIsSendingMessage(false);
        isProcessingRef.current = false;
      }
    },
    [
      botId,
      user?.id,
      contentMode,
      convertMessagesToHistory,
      chatWithBot,
      showSnackbar,
      deduplicateMessages,
      dispatch,
    ],
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
      const convertedMessages = convertApiMessagesToInternal(chatHistoryResponse.data.messages);
      const dedupedHistory = deduplicateMessages(convertedMessages);

      setMessages(prev => {
        const pendingLocalMessages = prev.filter(
          msg => isOptimisticMessage(msg) && !hasMatchingHistoryMessage(dedupedHistory, msg),
        );

        return deduplicateMessages([...dedupedHistory, ...pendingLocalMessages]);
      });
    }
  }, [
    chatHistoryResponse,
    convertApiMessagesToInternal,
    deduplicateMessages,
    hasMatchingHistoryMessage,
    isOptimisticMessage,
  ]);

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
    if (!botId || !user?.id) {
      // console.log('Cannot test API - missing botId or userId');
      return;
    }

    try {
      const testRequest: ChatWithBotRequest = {
        question: 'Hello',
        chat_history: [],
        bot_profile_id: botId,
        user_id: (user?.id as string) || '',
        category: contentMode, // Use contentMode from navbar (nsfw/sfw)
      };

      await chatWithBot(testRequest).unwrap();
    } catch (error) {
      console.error('API test failed:', error);
      console.error('Error details:', error);
    }
  }, [botId, user?.id, chatWithBot]);

  // Make testApiConnection available globally for debugging
  if (typeof window !== 'undefined') {
    (window as unknown as { testChatApi: typeof testApiConnection }).testChatApi =
      testApiConnection;
  }

  return {
    messages,
    isLoadingHistory,
    isSendingMessage,
    isTyping,
    showCreditsModal,
    setShowCreditsModal,
    sendMessage: sendChatMessage,
    loadChatHistory,
    markMessagesAsRead,
    testApiConnection,
    historyError,
  };
};

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInitiateChatMutation } from '@/redux/services/chatApi';
import { useAppSelector } from '@/redux/hooks';
import { useSnackbar } from '@/providers';

export const useChatInitiation = () => {
  const router = useRouter();
  const [isInitiating, setIsInitiating] = useState(false);
  const [initiateChat] = useInitiateChatMutation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { showSnackbar } = useSnackbar();

  const startChat = async (botId: string) => {
    console.log('botId ---->',botId)
    if (!isAuthenticated) {
      showSnackbar('Please login to start a chat', 'warning');
      return;
    }

    if (isInitiating) {
      return; // Prevent multiple simultaneous requests
    }

    setIsInitiating(true);

    try {
      const response = await initiateChat(botId).unwrap();

      console.log('Chat initiation response:', response);

      if (response.statusCode === 201 || response.statusCode === 200) {
        // Both new and existing chats are handled the same way
        const isNewChat = response.data.isNewConnection;
        console.log(
          `${isNewChat ? 'New' : 'Existing'} chat:`,
          response.data.chatId
        );

        router.push(`/chat?chatId=${response.data.chatId}`);
      } else {
        console.log('Unexpected status code:', response.statusCode);
        showSnackbar('Failed to start chat. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error initiating chat:', error);
      showSnackbar(
        error instanceof Error
          ? error.message
          : 'Failed to start chat. Please try again.',
        'error'
      );
    } finally {
      setIsInitiating(false);
    }
  };

  return {
    startChat,
    isInitiating,
  };
};

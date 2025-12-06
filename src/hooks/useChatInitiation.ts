import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInitiateChatMutation } from '@/redux/services/chatApi';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { openAuthModal } from '@/redux/slices/authSlice';
import { useSnackbar } from '@/providers';

export const useChatInitiation = () => {
  const router = useRouter();
  const [isInitiating, setIsInitiating] = useState(false);
  const [initiateChat] = useInitiateChatMutation();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  const startChat = async (botId: string) => {
    if (!isAuthenticated) {
      dispatch(openAuthModal({ mode: 'email-login' }));
      return;
    }

    if (isInitiating) {
      return; // Prevent multiple simultaneous requests
    }

    setIsInitiating(true);

    try {
      const response = await initiateChat(botId).unwrap();

      if (response.statusCode === 201 || response.statusCode === 200) {
        // Both new and existing chats are handled the same way
        const isNewChat = response.data.isNewConnection;

        router.push(`/chat?chatId=${response.data.chatId}`);
      } else {
        // console.log('Unexpected status code:', response.statusCode);
        showSnackbar('Failed to start chat. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error initiating chat:', error);
      showSnackbar(
        error instanceof Error ? error.message : 'Failed to start chat. Please try again.',
        'error',
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

'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { initializeAuthState, setCredentials } from '@/redux/slices/authSlice';
import { useSession } from 'next-auth/react';
import { useVerifySessionMutation } from '@/redux/services/googleAuthApi';

/**
 * Component that initializes authentication state from localStorage and verifies NextAuth sessions
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [verifySession] = useVerifySessionMutation();

  // Initialize auth state from localStorage
  useEffect(() => {
    dispatch(initializeAuthState());
  }, [dispatch]);

  // Verify NextAuth session with our backend
  useEffect(() => {
    const verifyNextAuthSession = async () => {
      if (session?.accessToken) {
        try {
          // Verify the session with our backend
          const response = await verifySession({
            sessionToken: session.accessToken,
            email: session.user?.email || '',
            userId: session.userId || '',
          }).unwrap();

          // If we get a successful response, update the auth state
          if (
            response.token ||
            (response.statusCode === 200 && response.accessToken)
          ) {
            // Manually dispatch setCredentials to update auth state
            dispatch(
              setCredentials(
                response as unknown as import('@/redux/services/authApi').LoginResponse
              )
            );
            console.log('NextAuth session verified and user authenticated');
          }
        } catch (error) {
          console.error('Failed to verify NextAuth session:', error);
        }
      }
    };

    verifyNextAuthSession();
  }, [session, verifySession, dispatch]);

  // This component doesn't render anything
  return null;
}

export default AuthInitializer;

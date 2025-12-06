import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = (NextAuth as any)({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account, profile }: any) {
      // When signing in
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.sub;
        token.provider = account.provider;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.exp as number) * 1000) {
        return token;
      }

      // Access token has expired, try to update it
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;
      session.userId = token.id as string;

      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account, profile }: any) {
      // Only process for Google provider
      if (account?.provider === 'google') {
        try {
          // Call backend API to create/update user in database
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/auth/google/callback`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: account.access_token,
                email: user.email,
                name: user.name,
                picture: user.image,
                googleId: profile?.sub || user.id,
              }),
            },
          );

          if (!response.ok) {
            console.error('Failed to create/update user in backend:', await response.text());
            // Still allow sign in even if backend call fails
            // The frontend will handle this in the session callback
          }
        } catch (error) {
          console.error('Error calling backend during Google sign in:', error);
          // Still allow sign in even if backend call fails
        }
      }

      // Allow sign in
      return true;
    },
  },
  pages: {
    signIn: '/', // Custom sign-in page not needed as we're using a modal
  },
  // Increase session lifetime
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
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
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;
      session.userId = token.id as string;

      return session;
    },
    async signIn({ user }) {
      // You can implement additional validation here
      // For example, check if the user's email is verified
      if (user.email) {
        return true;
      }

      // Allow sign in regardless
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

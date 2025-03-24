import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // Add custom session properties
      session.user.role = token.role || 'user';
      return session;
    },
    async jwt({ token, user }) {
      // Persist custom data to JWT
      if (user) {
        token.role = user.role || 'user';
      }
      return token;
    }
  },
  theme: {
    colorScheme: 'light',
    logo: '/logo.png',
  },
  debug: process.env.NODE_ENV === 'development',
});
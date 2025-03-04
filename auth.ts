import NextAuth, { type DefaultSession } from "next-auth";

//providers
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// prisma adapter
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma/prisma";
import { userModel } from "@/src/models/user";
import { passwordUtils } from "@/src/utils/password";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      authorize: async (credentials) => {
        const user = await userModel.findByEmail(credentials.email as string);

        if (!user) throw new Error("Invalid credentials.");
        if (!user.hash) throw new Error("Invalid credentials.");

        const isCorrectPass = passwordUtils.comparePassAndHash(
          credentials.password as string,
          user.hash
        );

        if (!isCorrectPass) throw new Error("Invalid credentials.");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    Google,
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session: async ({ token, session }) => {
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
});

import NextAuth, { type DefaultSession } from "next-auth";

//providers
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// prisma adapter
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma/prisma";
import { passwordUtils } from "@/src/utils/password";
import { workerModel } from "@/src/app/(back)/models/worker";
import { userModel } from "@/src/app/(back)/models/user";

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
        login: { label: "Login", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      authorize: async (credentials) => {
        if (!credentials?.login || !credentials?.password) {
          throw new Error("Login e senha são obrigatórios.");
        }

        // Buscar usuário tanto em `workerModel` quanto `userModel` simultaneamente
        const [worker, user] = await Promise.all([
          workerModel.findUniqueBy({ login: credentials.login as string }),
          userModel.findBy({ email: credentials.login as string }),
        ]);

        // Definir o usuário encontrado
        const foundUser = worker || user;
        if (!foundUser || !foundUser.hash) {
          throw new Error("Credenciais inválidas.");
        }

        // Verificar senha
        const isCorrectPass = passwordUtils.comparePassAndHash(
          credentials.password as string,
          foundUser.hash,
        );

        if (!isCorrectPass) {
          throw new Error("Credenciais inválidas.");
        }

        return {
          id: foundUser.id,
          name: foundUser.name,
          login: "login" in foundUser ? foundUser.login : foundUser.email,
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

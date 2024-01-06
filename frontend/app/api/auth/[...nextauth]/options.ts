import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, {
  Account,
  NextAuthOptions,
  Profile,
  User,
  Session,
  getServerSession,
} from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { AdapterUser } from "next-auth/adapters";
import { getSession } from "next-auth/react";
import { Asap_Condensed } from "next/font/google";

interface NewUser {
  name: string | null | undefined;
  email: string | null | undefined;
  user_id: string;
  created_at: Date;
  access_token: string | null | undefined;
  platform: string | undefined;
}
let idk = {};
export const OPTIONS: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "DEFAULT_CLIENT_ID",
      clientSecret:
        process.env.FACEBOOK_CLIENT_SECRET || "DEFAULT_CLIENT_SECRET",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "DEFAULT_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "DEFAULT_CLIENT_SECRET",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },

    async signIn({
      user,
      account,
    }: {
      user: User | AdapterUser;
      account: Account | null;
    }) {
      const currentProvider = account?.provider;
      const currentSession = await getServerSession(OPTIONS);

      if (account) {
        // Access the current authentication provider
        const getCurrentToken = await getSession();
        console.log(idk);
        console.log("Current Token:", getCurrentToken);
        console.log("Current Session:", currentSession);
        console.log("Current Authentication Provider:", currentProvider);
      }
      if (!account) {
        account = {
          access_token: "DEFAULT_ACCESS_TOKEN",
          providerAccountId: "DEFAULT_PROVIDER_ACCOUNT_ID",
          provider: "currentProvider",
          type: "oauth",
        };
      }
      const newUser: NewUser = {
        name: user.name,
        email: user.email,
        user_id: user.id,
        created_at: new Date(),
        access_token: account.access_token,
        platform: currentProvider,
      };
      console.log("New User", newUser);
      // 1. User simply just signing in normally
      // -
      // 2. The user is already signed in but wants to aconect to another account
      // 3, Create a new user first time

      // Check if its a existing user
      // Check if user exists but is connecting another account
      // Create a new user
      let data;

      if (currentSession) {
        data = {
          // @ts-ignore
          currentUser: currentSession.user?.id,
          newUser: newUser,
        };
        console.log("Done");
      } else {
        data = {
          // @ts-ignore
          currentUser: "None",
          newUser: newUser,
        };
        console.log("done2");

      }

      // const newData = {
      //   name: "Brandon",
      //   user_id: "21312321",
      //   email: "brandon@gmail.com",
      // };
      // const d = {
      //   currentUser: "21312321",
      //   newUser: newData,
      // };
      console.log("Current Session:", currentSession);
      console.log("New Session:", newUser);
      console.log("Data",data)

      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/checkUser",
        data
      );

      // const res = await axios.post(
      //   "http://127.0.0.1:8000/api/users/createUser",
      //   newUser
      // );

      if (res.status === 200) {
        user.id = newUser.user_id; // Store the user_id in the user object

        return true;
      } else {
        return false;
      }
    },
  },
};

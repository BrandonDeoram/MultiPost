"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/UserContext";
import { addUserToCookieList, getUserListFromCookie } from "@/lib/cookie";
import axios from "axios";

const DashBoard = () => {
  const session = useSession();
  const { setUser, userId } = useUser();

  useEffect(() => {
    // User id that is not the same as the current user
    if (session.status == "authenticated") {
      // @ts-ignore
      const userId = session.data?.user.id;
      setUser(userId);
      addUserToCookieList(userId);
      const userList = JSON.stringify(getUserListFromCookie());
      console.log("userList", userList);
    }
  }, [session]);

  return (
    <>
      <button onClick={() => signOut()}>Sign out</button>
      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
        Sign in
      </button>
    </>
  );
};

export default DashBoard;

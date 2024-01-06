"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import dash from "../public/dashboard.png";
import Image from "next/image";
import HomeCard from "@/components/HomeCard";
export default function Home() {
  const { data: session, status } = useSession();
  console.log("status", status);
  console.log("session", session);
  //sign out using next auth facebook
  if (session) {
    console.log("SESSION", session);
    redirect("/dashboard");
    return null; // You can also return a loading state here if needed
  }
  return (
    <>
      <section className="w-full h-full flex items-center justify-center flex-col mt-20">
        <h1 className="text-4xl sm:text-5xl text-center tracking-wider font-semibold self-center">
          Connect all your
          <br className="max-md:hidden" />
          <span className="text-center"> social media accounts</span>
        </h1>
        <h2 className="text-center items-center max-w-lg text-sm mt-5 text-gray-300">
          View analytics for your posts, comments, and likes. Schedule post and
          post on all your social media accounts.
        </h2>
        <Button className="mt-5  hover:bg-blue-100">Get Started</Button>
        <Image src={dash} alt="" className="mt-10 sm:mt-5 rounded-2xl"></Image>
      </section>

      <section className="w-full h-full max-h-full flex items-center justify-center flex-col mt-20">
        <h1 className="text-4xl sm:text-5xl text-center tracking-wider font-semibold self-center">
          Post on all accounts
        </h1>
        <h2 className="text-center items-center max-w-lg text-sm mt-5 text-gray-300">
          Post on all social media accounts simoustanly
        </h2>
        <HomeCard></HomeCard>
      </section>
      <section className="w-full h-full flex items-center justify-center flex-col mt-20">
        <h1 className="text-4xl sm:text-5xl text-center tracking-wider font-semibold self-center">
          Schedule stories, posts
        </h1>
        <h2 className="text-center items-center max-w-lg text-sm mt-5 text-gray-300">
          Post on all social media accounts simoustanly
        </h2>
        <Image src={dash} alt="" className="mt-10 sm:mt-5 rounded-2xl"></Image>
      </section>
    </>
  );
}

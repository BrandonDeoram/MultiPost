"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Charts from "@/components/dashboard-comp/chart";
import VideoTable from "@/components/dashboard-comp/VideoTable";
import { columns } from "./columns";
import CardRow from "@/components/dashboard-comp/CardRow";
import { useSession } from "next-auth/react";
import { addUserToCookieList, getUserListFromCookie } from "@/lib/cookie";
import { useUser } from "@/hooks/UserContext";

interface Video {
  id: number;
  name: string;
  platform: string;
  date: string;
  views: number;
}

const DashBoard = () => {
  const [reelsData, setReelsData] = useState({});
  const [shortsData, setShortsData] = useState({});
  const [loading, setLoading] = useState(true); // Introduce loading state
  const [combinedData, setCombinedData] = useState<Video[]>([]);
  const session = useSession();
  const { setUser, userId } = useUser();
  const [reelsViews, setReelsViews] = useState(0);
  const [shortsViews, setShortsViews] = useState(0);
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
  useEffect(() => {
    async function getData() {
      let totalViews = 0;
      try {
        const [reelsResponse, shortsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/video/getInstagramReelsViews"),
          axios.get("http://127.0.0.1:8000/api/video/getYoutubeShortsViews"),
        ]);

        const combData = [
          ...reelsResponse.data["reels"],
          ...shortsResponse.data["shorts"],
        ];
        // Add total views into variable
        reelsResponse.data["reels"].forEach((reel: { views: number }) => {
          totalViews += reel.views;
        });

        setReelsViews(totalViews);
        totalViews = 0;

        shortsResponse.data["shorts"].forEach((short: { views: number }) => {
          totalViews += Number(short.views);
        });

        setShortsViews(totalViews);
        setCombinedData(combData);
        setReelsData(reelsResponse.data);
        reelsResponse.data["reels"];
        setShortsData(shortsResponse.data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false on error as well
      }
    }
    getData();
  }, []);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex mb-10 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 w-full relative">
          <div className="w-full flex-col  bg-slate-900 p-5">
            <h1 className="text-1xl justify-center flex rounded-sm">
              Welcome Back
            </h1>
            <h1 className="text-3xl font-bold justify-center flex  rounded-sm">
              Sanjay Deoram
            </h1>
          </div>
          <CardRow shortsViews={shortsViews} reelsViews={reelsViews} />
          <div className="hidden sm:block items-center justify-between">
            <VideoTable columns={columns} data={combinedData} />
          </div>
          <div className="hidden sm:block">
            <Charts reels={reelsData} shorts={shortsData} />
          </div>
        </div>
      )}
    </>
  );
};

export default DashBoard;

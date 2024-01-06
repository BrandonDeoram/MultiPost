import React from "react";
import Image, { StaticImageData } from "next/image";
import facebook from "../public/facebook.png";
import youtube from "../public/youtube.png";
import instagram from "../public/instagram.png";
import tiktok from "../public/tiktok.png";
const HomeCard = () => {
  interface Platform {
    name: string;
    path: StaticImageData;
  }

  const platforms: Platform[] = [
    { name: "Facebook", path: facebook },
    { name: "Instagram", path: instagram },
    { name: "Youtube", path: youtube },
    { name: "Tiktok", path: tiktok },
  ];
  return (
    <div className="bg-gray-900 p-10 rounded-lg w-full items-center justify-center flex mt-5">
      <div className="gap-10 grid sm:gap-20 grid-cols-2 items-center max-w-lg">
        {platforms.map((platform) => (
          <div key={platform.name} className="mt-5">
            <div>
              <Image
                className="md:h-full md:w-full max-w-xs sm:h-24"
                src={platform.path}
                alt=""
                width={100}
                height={100}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCard;

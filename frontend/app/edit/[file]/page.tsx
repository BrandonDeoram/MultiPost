"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getS3Url } from "@/lib/db/s3";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTime } from "@/components/ui/DateTime";
import { Button } from "@/components/ui/button";
type Props = {
  params: {
    file: string;
  };
};

const EditPage = ({ params: { file } }: Props) => {
  const router = useRouter();
  const fileKey = file.replaceAll("-", "/");
  const [videoUrl, setVideoUrl] = useState("");
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlVideo = getS3Url(fileKey);
    setVideoUrl(urlVideo);
    console.log(urlVideo);
  }, [fileKey]); // Empty dependencies array
  function handleClick() {
    setLoading(true);
    // wait 10 second
    setTimeout(() => {
      setLoading(false);
      setClicked(true);
    }, 3000);
  }
  return loading ? (
    <div className="w-full flex justify-center ">Loading...</div>
  ) : clicked ? (
    <div className="w-full flex justify-center ">Video uploaded successfully!</div>
  ) : (
    <div className="m-2 w-full">
      <h1 className="text-2xl font-bold mb-4">Edit Page</h1>
      {videoUrl ? (
        <video
          controls
          className="w-full max-w-xl md:justify-center self-center mx-auto flex"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>No video available</p>
      )}
      <h1 className="mt-6 text-2xl font-bold mb-4 md:text-3xl">
        Youtube Shorts
      </h1>
      <div className="ml-1">
        <Label className="text-1xl md:text-xl">Title</Label>
        <Textarea className="mt-2" maxLength={100} />

        <div className="mt-4">
          <Label className="text-1xl md:text-xl">Description</Label>
          <Textarea className="mt-2" maxLength={5000} />
        </div>
        <div className="mt-4">
          <Label className="text-1xl md:text-xl">Tags</Label>
          <Textarea className="mt-2" maxLength={500} />
        </div>
      </div>
      <hr className="ml-2 border-2 border-gray-300 my-8" />

      <h1 className="ml-1 mt-6 text-2xl font-bold mb-4 md:text-3xl">
        Instagram Reels
      </h1>
      <div className="ml-1">
        <Label className="text-1xl md:text-xl">Caption</Label>
        <Textarea className="mt-2" maxLength={2200} />
      </div>
      <hr className="ml-2 border-2 border-gray-300 my-8" />
      <h1 className="ml-1 mt-6 text-2xl font-bold mb-4 md:text-3xl">
        Schedule Video
      </h1>
      <div className="ml-1 mt-4 mb-10 flex flex-col lg:flex-row lg:items-center lg:space-x-4 sm:justify-between">
        <div className="mb-4 lg:mb-0">
          <DateTime />
        </div>
        <Button className="w-full lg:w-fit" onClick={handleClick}>
          Post/Schedule
        </Button>
      </div>
    </div>
  );
};

export default EditPage;

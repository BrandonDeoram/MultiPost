"use client";
import axios from "axios";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { uploadToS3 } from "@/lib/db/s3";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
const Upload = () => {
  useEffect(() => {
    const userIdsString = Cookies.get("userIds");
    if (userIdsString) {
      const userIdsArray = JSON.parse(userIdsString);
      //declare string variable in typescript
      const userId = userIdsArray[0] as string;
      setUserId(userId);
      console.log("userIdsArray", userIdsArray[0]);
    }
  }, []);

  const [uploading, setUploading] = React.useState(false);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  const { getRootProps, getInputProps } = useDropzone({
    // accept: { "application/pdf": [".pdf"] },
    accept: {
      "video/mp4": [".mp4", ".MP4"],
      "image/png": [".png", ".PNG"],
      "image/jpeg": [".jpeg", ".JPEG"],
    },
    maxFiles: 1,

    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      console.log(file);
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        console.log("File too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(userId, file);
        console.log(data.file_key);
        const fileKey = data.file_key.replaceAll("/", "-");
        console.log(fileKey);
        if (data) {
          const timer = setTimeout(() => {
            setUploading(false);
            router.push(`/edit/${fileKey}`);
          }, 2000);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div className="w-full h-full  mx-auto ">
      <div className="p-2 bg-white rounded-xl w-full h-[30rem]">
        <div
          {...getRootProps({
            className:
              "rounded-xl cursor-pointer bg-gray-50 py-8 mx-auto flex justify-center items-center flex-col h-full w-full",
          })}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
              <p className="mt-2 text-sm text-slate-400">Uploading...</p>
            </>
          ) : (
            <>
              <Inbox className="w-10 h-10 text-blue-500" />
              <p className="mt-2 text-sm text-slate-400">Upload Media</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;

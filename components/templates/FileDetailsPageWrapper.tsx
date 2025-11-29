"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import FileDetailsPage from "./FileDetailsPage";
import { FrontFileType } from "@/models/RSFile";

const FileDetailsPageWrapper = ({ file }: { file: FrontFileType }) => {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          const user = data.user;
          setIsAdmin(user?.role === "ADMIN");
          setIsSubAdmin(user?.role === "SUBADMIN");
          setIsOwner(user?._id === file.userId?.toString());
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [session, file.userId]);

  // Check if file is published - if not, only show to admins/owners
  if (!file.published && !isAdmin && !isSubAdmin && !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">آگهی یافت نشد</h2>
        <p className="text-gray-600 dark:text-gray-400">
          این آگهی در دسترس نیست یا هنوز تایید نشده است.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <FileDetailsPage 
      file={file} 
      isAdmin={isAdmin} 
      isSubAdmin={isSubAdmin} 
      isOwner={isOwner} 
    />
  );
};

export default FileDetailsPageWrapper;


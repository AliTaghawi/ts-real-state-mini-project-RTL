"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/stor";
import toast from "react-hot-toast";
import { e2p } from "@/utils/replaceNumber";
import { MdEmail, MdPhone, MdAdminPanelSettings } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import FileCard from "@/modules/FileCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfilePageProps {
  user: any;
  files: any[];
  isAdmin: boolean;
  isCurrentUser: boolean;
}

const UserProfilePage = ({
  user,
  files,
  isAdmin,
  isCurrentUser,
}: UserProfilePageProps) => {
  const currentUser = useSelector((store: RootState) => store.user.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const requestSubadmin = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user._id}/request-subadmin`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        router.refresh();
      }
    } catch (error) {
      toast.error("خطا در ارسال درخواست");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4">
      <div className="bg-white dark:bg-gray-900 border border-sky-400 dark:border-sky-800 rounded-xl shadow-md dark:shadow-sky-950 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-sky-500 flex items-center justify-center text-white text-3xl">
              <FaUser />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {e2p(user.showName || user.fullName || "کاربر")}
              </h1>
              {user.role === "ADMIN" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-md text-sm">
                  <MdAdminPanelSettings /> مدیر
                </span>
              )}
              {user.role === "SUBADMIN" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-md text-sm">
                  <MdAdminPanelSettings /> مدیر فرعی
                </span>
              )}
            </div>
          </div>
          {isCurrentUser && (
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
            >
              ویرایش پروفایل
            </Link>
          )}
        </div>

        {user.bio && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">درباره</h3>
            <p className="text-gray-700 dark:text-gray-300">{e2p(user.bio)}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.showSocials?.email && (
            <div className="flex items-center gap-2">
              <MdEmail className="text-sky-500 text-xl" />
              <span className="text-sm">{e2p(user.email)}</span>
            </div>
          )}
          {user.showSocials?.phone && user.phone && (
            <div className="flex items-center gap-2">
              <MdPhone className="text-sky-500 text-xl" />
              <span className="text-sm">{e2p(user.phone)}</span>
            </div>
          )}
        </div>

        {!isCurrentUser &&
          currentUser &&
          currentUser.role === "USER" &&
          user.role === "USER" &&
          !user.subadminRequest && (
            <div className="mt-4 pt-4 border-t border-sky-200 dark:border-sky-800">
              <button
                onClick={requestSubadmin}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "در حال ارسال..." : "درخواست مدیر فرعی شدن"}
              </button>
            </div>
          )}

        {user.subadminRequest && (
          <div className="mt-4 pt-4 border-t border-sky-200 dark:border-sky-800">
            <p className="text-yellow-600 dark:text-yellow-400 text-sm">
              درخواست مدیر فرعی شدن در انتظار تایید است
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">آگهی‌های منتشر شده</h2>
        {files.length > 0 ? (
          <div className="grid grid-cols-1 min-[820px]:grid-cols-2 min-[1150px]:grid-cols-3 gap-4">
            {files.map((file: any) => (
              <FileCard key={file._id} file={JSON.parse(JSON.stringify(file))} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">هیچ آگهی‌ای یافت نشد</p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;


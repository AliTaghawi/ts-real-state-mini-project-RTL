"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import {AppDispatch, RootState } from "@/redux/stor";
import DetailsItem from "@/elements/profilePage/DetailsItem";
import Link from "next/link";
import DeletePopup from "@/modules/profilePage/DeletePopup";
import { toggleDeletePopup } from "@/redux/features/displays/displaysSlice";
import toast from "react-hot-toast";
import { fetchUser } from "@/redux/features/user/userSlice";

const linkStyle ="flex items-center text-emerald-800 dark:text-emerald-500 dark:hover:bg-sky-950 hover:bg-sky-100 rounded-sm py-0.5 px-1 transition ease-linear";

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((store: RootState) => store.user.user);
  const [loading, setLoading] = useState(false);

  const requestSubadmin = async () => {
    if (!user?._id) return;
    
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
        dispatch(fetchUser());
        router.refresh();
      }
    } catch (error) {
      toast.error("خطا در ارسال درخواست");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <p>سلام {user?.fullName || user?.showName} جان 👋</p>
        <div className="flex gap-2 bg-sky-100 dark:bg-sky-900 py-0.5 px-1 rounded-sm">
          <p>تاریخ عضویت:</p>
          <span>
            {user?.createdAt &&
              new Date(user?.createdAt).toLocaleDateString("fa-ir")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <DetailsItem title="نام کاربری" property={user?.email} />
          <span className="max-[375px]:mt-7">
            {user?.showSocials?.email ? (
              <FaRegEye title="برای کاربرها نمایش داده میشود" />
            ) : (
              <FaRegEyeSlash title="برای کاربرها نمایش داده نمیشود" />
            )}
          </span>
        </div>
        <DetailsItem title="نام و نام خانوادگی" property={user?.fullName} />
        <DetailsItem
          title="نامی که به کاربران نشان داده میشود"
          property={user?.showName}
        />
        <div className="flex items-center gap-2">
          <DetailsItem title="شماره تماس" property={user?.phone} />
          <span className="max-[375px]:mt-7">
            {user?.showSocials?.phone ? (
              <FaRegEye title="برای کاربرها نمایش داده میشود" />
            ) : (
              <FaRegEyeSlash title="برای کاربرها نمایش داده نمیشود" />
            )}
          </span>
        </div>
        <DetailsItem title="درباره من" property={user?.bio} bioType={true} />
        {user?.role === "USER" && (
          <div className="mt-4 p-4 border border-sky-400 dark:border-sky-800 rounded-lg bg-sky-50 dark:bg-sky-950/30">
            {user.subadminRequest ? (
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                درخواست مدیر فرعی شدن شما در انتظار تایید است (مدیر فرعی فقط برای دیدن پنل ادمین هست)
              </p>
            ) : (
              <div>
                <p className="text-sm mb-2">می‌خواهید به عنوان مدیر فرعی فعالیت کنید؟ (مدیر فرعی فقط برای دیدن پنل ادمین هست)</p>
                <button
                  onClick={requestSubadmin}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? "در حال ارسال..." : "درخواست مدیر فرعی شدن"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="my-4 flex gap-4 items-start flex-wrap">
        <div className="flex gap-4 flex-wrap">
          <Link href="/dashboard/profile/edit" className={linkStyle}>
            <CiEdit className="text-xl" />
            {user?.fullName && user.phone && user.bio
              ? "تغییر حساب کاربری"
              : "تکمیل حساب کاربری"}
          </Link>
          <Link href="/dashboard/profile/change-password" className={linkStyle}>
            <CiEdit className="text-xl" />
            تغییر رمز عبور
          </Link>
        </div>
        <button
          onClick={() => dispatch(toggleDeletePopup())}
          className="flex items-center py-0.5 px-1.5 border-2 border-red-700 text-red-700 hover:bg-red-50 dark:hover:bg-red-400/20 rounded-md mr-auto text-sm transition ease-linear"
        >
          <MdDeleteForever className="text-xl" />
          حذف حساب کاربری
        </button>
        <DeletePopup />
      </div>
    </>
  );
};

export default ProfilePage;

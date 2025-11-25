"use client"

import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { MdLocationPin, MdDeleteForever } from "react-icons/md";
import { LuClipboardType } from "react-icons/lu";
import { IoMdPricetag } from "react-icons/io";
import { GrStatusUnknown } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { BiLeftArrowAlt } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { FrontFileType } from "@/models/RSFile";
import { categoryIcons, categoryText, fileTypesText } from "@/utils/constants";
import { AppDispatch } from "@/redux/stor";
import { fetchUser } from "@/redux/features/user/userSlice";
import { e2p, sp } from "@/utils/replaceNumber";

const itemsStyle = "flex gap-1 items-center";

const FileCard = ({
  file: { title, location, price, category, fileType, published, _id, userId },
  dashPage,
}: {
  file: FrontFileType & { userId?: { _id: string; showName?: string; fullName?: string } | string };
  dashPage?: boolean
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const deleteHandler = async () => {
    const result = await fetch(`/api/files/${_id}`, { method: "DELETE" });
    const res = await result.json();
    if (res.error) {
      toast.error(res.error);
    } else {
      dispatch(fetchUser());
    }
  };

  // console.log(location, ":", published)

  return (
    <div className="flex flex-col gap-2 items-start p-4 border border-sky-400 dark:border-sky-800 rounded-xl shadow-md dark:shadow-sky-950 max-w-[450px] w-full mx-auto sm:mx-0 h-full">
      <h4 className="text-sm font-bold ms-1">{e2p(title)}</h4>
      <div className={itemsStyle}>
        <MdLocationPin className="text-xl text-sky-400 dark:text-sky-500" />
        <span>{e2p(location)}</span>
      </div>
      <div className={itemsStyle}>
        {categoryIcons[category]}
        <span>{categoryText[category]}</span>
      </div>
      <div className={itemsStyle}>
        <LuClipboardType className="text-lg text-sky-400 dark:text-sky-500" />
        <span>{fileTypesText[fileType]}</span>
      </div>
      <div className={`${itemsStyle} items-start text-sm`}>
        <IoMdPricetag className="text-lg text-sky-400 dark:text-sky-500" />
        {typeof price === "number" ? (
          <span className="text-neutral-700 dark:text-neutral-400">
            {sp(price)} تومان
          </span>
        ) : (
          <div className="flex flex-col items-start gap-2">
            <div>
              <span className="font-bold me-1.5">رهن:</span>
              <span className=" text-neutral-700 dark:text-neutral-400">
                {sp(price.mortgage)} تومان
              </span>
            </div>
            <div>
              <span className="font-bold me-1.5">اجاره:</span>
              <span className=" text-neutral-700 dark:text-neutral-400">
                {sp(price.rent)} تومان
              </span>
            </div>
          </div>
        )}
      </div>
      {userId && typeof userId === "object" && (
        <div className={itemsStyle}>
          <FaUser className="text-lg text-sky-400 dark:text-sky-500" />
          <span>آگهی‌دهنده:</span>
          <Link
          href={`/users/${userId._id}`}
          className={`${itemsStyle} text-sm text-sky-600 dark:text-sky-400 py-1 px-1.5 hover:bg-sky-100 dark:hover:bg-sky-950 rounded-md transition ease-linear`}
        >
          {e2p(userId.showName || userId.fullName || "کاربر")}
        </Link>
        </div>
      )}
      {dashPage && (<div className={`${itemsStyle} text-sm font-semibold`}>
        <GrStatusUnknown className="text-lg text-sky-400 dark:text-sky-500" />
        <div>
          <span className="me-1.5">وضعیت آگهی:</span>
          {published ?? (
            <span className="text-neutral-500 dark:text-neutral-400">
              در انتظار تایید
            </span>
          )}
          {published && <span className="text-emerald-500">تایید شده</span>}
          {published === false && <span className="text-red-400">تایید نشد</span>}
        </div>
      </div>)}
      <Link
        href={`/property-files/${_id}`}
        className={`${itemsStyle} text-sm font-semibold text-emerald-600 dark:text-emerald-400 py-1 px-1.5 hover:bg-sky-100 dark:hover:bg-sky-950 rounded-md transition ease-linear`}
      >
        مشاهده آگهی <BiLeftArrowAlt className="text-xl" />
      </Link>
      {dashPage && (<div className="flex justify-between items-center w-full mt-auto">
        <Link
          href={`/dashboard/add-file/${_id}`}
          className="flex items-center text-emerald-700 dark:text-emerald-500 gap-0.5 py-0.5 px-1.5 hover:bg-sky-100 dark:hover:bg-sky-950 rounded-md transition ease-linear font-medium mt-2"
        >
          <CiEdit className="text-xl" /> تغییر
        </Link>
        <button
          onClick={deleteHandler}
          className="flex items-center text-red-700 gap-0.5 px-1.5 border border-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-400/20 transition ease-linear"
        >
          حذف <MdDeleteForever />
        </button>
      </div>)}
      <Toaster />
    </div>
  );
};

export default FileCard;

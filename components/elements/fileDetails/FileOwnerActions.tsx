"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/stor";
import { fetchUser } from "@/redux/features/user/userSlice";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

interface FileOwnerActionsProps {
  fileId: string;
}

const FileOwnerActions = ({ fileId }: FileOwnerActionsProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const deleteHandler = async () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این آگهی را حذف کنید؟")) {
      return;
    }

    const result = await fetch(`/api/files/${fileId}`, { method: "DELETE" });
    const res = await result.json();
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("آگهی با موفقیت حذف شد");
      dispatch(fetchUser());
      // برگشت به صفحه قبل (صفحه جزئیات)
      router.back();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center w-full gap-2">
        <Link
          href={`/dashboard/add-file/${fileId}`}
          className="flex items-center text-emerald-700 dark:text-emerald-500 gap-0.5 py-0.5 px-1.5 hover:bg-sky-100 dark:hover:bg-sky-950 rounded-md transition ease-linear font-medium"
        >
          <CiEdit className="text-xl" /> تغییر
        </Link>
        <button
          onClick={deleteHandler}
          className="flex items-center text-red-700 dark:text-red-400 gap-0.5 px-1.5 border border-red-700 dark:border-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-400/20 transition ease-linear"
        >
          حذف <MdDeleteForever />
        </button>
      </div>
      <Toaster />
    </>
  );
};

export default FileOwnerActions;


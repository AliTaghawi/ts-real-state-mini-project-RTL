"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { MdCheckCircle, MdCancel, MdRemoveCircle } from "react-icons/md";
import { useRouter } from "next/navigation";

interface AdminFileActionsProps {
  fileId: string;
  currentStatus: boolean | null | undefined;
}

const AdminFileActions = ({ fileId, currentStatus }: AdminFileActionsProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (published: boolean | null) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/files/${fileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        router.refresh();
      }
    } catch (error) {
      toast.error("خطا در به‌روزرسانی وضعیت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-[0px_4px_10px] shadow-sky-950/40 rounded-lg p-4 mb-4 border-2 border-purple-400 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30">
      <h3 className="font-bold mb-3 text-purple-700 dark:text-purple-300">
        پنل مدیریت
      </h3>
      <div className="mb-3">
        <span className="text-sm font-semibold me-2">وضعیت فعلی:</span>
        {currentStatus === true ? (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm">
            <MdCheckCircle /> منتشر شده
          </span>
        ) : currentStatus === false ? (
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
            <MdCancel /> رد شده
          </span>
        ) : (
          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-sm">
            <MdRemoveCircle /> در انتظار
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => updateStatus(true)}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdCheckCircle />
          تایید و انتشار
        </button>
        <button
          onClick={() => updateStatus(false)}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdCancel />
          رد آگهی
        </button>
        <button
          onClick={() => updateStatus(null)}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdRemoveCircle />
          بازگشت به حالت انتظار
        </button>
      </div>
    </div>
  );
};

export default AdminFileActions;


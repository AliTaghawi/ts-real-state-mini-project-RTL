"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import FileCard from "@/modules/FileCard";
import { e2p } from "@/utils/replaceNumber";
import { MdCheckCircle, MdCancel, MdRemoveCircle } from "react-icons/md";

const AdminFilesSection = ({ isAdmin }: { isAdmin: boolean }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "published" | "denied">("all");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/files");
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setFiles(data.files || []);
      }
    } catch (error) {
      toast.error("خطا در دریافت آگهی‌ها");
    } finally {
      setLoading(false);
    }
  };

  const updateFileStatus = async (fileId: string, published: boolean | null) => {
    try {
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
        fetchFiles();
      }
    } catch (error) {
      toast.error("خطا در به‌روزرسانی وضعیت");
    }
  };

  const getStatusBadge = (published: boolean | null | undefined) => {
    if (published === true) {
      return (
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <MdCheckCircle /> منتشر شده
        </span>
      );
    } else if (published === false) {
      return (
        <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <MdCancel /> رد شده
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
          <MdRemoveCircle /> در انتظار
        </span>
      );
    }
  };

  const filteredFiles = files.filter((file) => {
    if (filter === "all") return true;
    if (filter === "pending") return file.published === undefined || file.published === null;
    if (filter === "published") return file.published === true;
    if (filter === "denied") return file.published === false;
    return true;
  });

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "all"
              ? "bg-sky-500 text-white"
              : "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300"
          }`}
        >
          همه
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "pending"
              ? "bg-sky-500 text-white"
              : "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300"
          }`}
        >
          در انتظار ({files.filter((f) => !f.published && f.published !== false).length})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "published"
              ? "bg-sky-500 text-white"
              : "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300"
          }`}
        >
          منتشر شده ({files.filter((f) => f.published === true).length})
        </button>
        <button
          onClick={() => setFilter("denied")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "denied"
              ? "bg-sky-500 text-white"
              : "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300"
          }`}
        >
          رد شده ({files.filter((f) => f.published === false).length})
        </button>
      </div>

      <div className="grid grid-cols-1 min-[820px]:grid-cols-2 min-[1150px]:grid-cols-3 gap-4 gap-y-8 mb-8">
        {filteredFiles.map((file: any) => (
          <div key={file._id} className="flex flex-col">
            <div className="flex-1">
              <FileCard file={JSON.parse(JSON.stringify(file))} />
            </div>
            <div className="mt-2 p-3 border border-sky-400 dark:border-sky-800 rounded-lg bg-white dark:bg-gray-900">
              <div className="mb-2">
                <span className="text-sm font-semibold me-2">وضعیت:</span>
                {getStatusBadge(file.published)}
              </div>
              {file.userId && (
                <div className="mb-2 text-sm">
                  <span className="font-semibold me-2">کاربر:</span>
                  <span>{e2p(file.userId.showName || file.userId.email || "نامشخص")}</span>
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => updateFileStatus(file._id, true)}
                  disabled={!isAdmin}
                  className={`flex-1 px-3 py-1.5 rounded-md transition-colors text-sm ${
                    isAdmin
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed opacity-50"
                  }`}
                >
                  تایید
                </button>
                <button
                  onClick={() => updateFileStatus(file._id, false)}
                  disabled={!isAdmin}
                  className={`flex-1 px-3 py-1.5 rounded-md transition-colors text-sm ${
                    isAdmin
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed opacity-50"
                  }`}
                >
                  رد
                </button>
                <button
                  onClick={() => updateFileStatus(file._id, null)}
                  disabled={!isAdmin}
                  className={`flex-1 px-3 py-1.5 rounded-md transition-colors text-sm ${
                    isAdmin
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed opacity-50"
                  }`}
                >
                  در انتظار
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          آگهی‌ای یافت نشد
        </div>
      )}
    </div>
  );
};

export default AdminFilesSection;


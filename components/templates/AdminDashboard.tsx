"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/stor";
import AdminFilesSection from "@/modules/admin/AdminFilesSection";
import AdminUsersSection from "@/modules/admin/AdminUsersSection";
import { TbFiles, TbUsers } from "react-icons/tb";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"files" | "users">("files");
  const user = useSelector((store: RootState) => store.user.user);

  if (user?.role !== "ADMIN") {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">شما دسترسی به این صفحه ندارید</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-6">پنل مدیریت</h1>
      
      <div className="flex gap-4 mb-6 border-b border-sky-400 dark:border-sky-800">
        <button
          onClick={() => setActiveTab("files")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            activeTab === "files"
              ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
              : "text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
          }`}
        >
          <TbFiles className="text-xl" />
          مدیریت آگهی‌ها
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            activeTab === "users"
              ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
              : "text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
          }`}
        >
          <TbUsers className="text-xl" />
          مدیریت کاربران
        </button>
      </div>

      {activeTab === "files" && <AdminFilesSection />}
      {activeTab === "users" && <AdminUsersSection />}
    </div>
  );
};

export default AdminDashboard;


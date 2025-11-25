"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/stor";
import AdminFilesSection from "@/modules/admin/AdminFilesSection";
import AdminUsersSection from "@/modules/admin/AdminUsersSection";
import AdminNotificationsSection from "@/modules/admin/AdminNotificationsSection";
import { TbFiles, TbUsers, TbBell } from "react-icons/tb";

const AdminDashboard = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"files" | "users" | "notifications">(
    (tabParam === "files" || tabParam === "users" ? tabParam : "notifications") as "files" | "users" | "notifications"
  );

  useEffect(() => {
    if (tabParam === "files" || tabParam === "users") {
      setActiveTab(tabParam as "files" | "users");
    }
  }, [tabParam]);
  const user = useSelector((store: RootState) => store.user.user);
  const isAdmin = user?.role === "ADMIN";
  const isSubAdmin = user?.role === "SUBADMIN";

  if (!isAdmin && !isSubAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">شما دسترسی به این صفحه ندارید</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">پنل مدیریت</h1>
        {isSubAdmin && (
          <span className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-md">
            حالت مشاهده فقط
          </span>
        )}
      </div>
      
      <div className="flex gap-4 mb-6 border-b border-sky-400 dark:border-sky-800">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            activeTab === "notifications"
              ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
              : "text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
          }`}
        >
          <TbBell className="text-xl" />
          اعلان‌ها
        </button>
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

      {activeTab === "notifications" && <AdminNotificationsSection />}
      {activeTab === "files" && <AdminFilesSection isAdmin={isAdmin} />}
      {activeTab === "users" && <AdminUsersSection isAdmin={isAdmin} />}
    </div>
  );
};

export default AdminDashboard;


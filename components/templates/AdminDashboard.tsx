"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/stor";
import AdminFilesSection from "@/modules/admin/AdminFilesSection";
import AdminUsersSection from "@/modules/admin/AdminUsersSection";
import AdminNotificationsSection from "@/modules/admin/AdminNotificationsSection";
import AdminSlidersSection from "@/modules/admin/AdminSlidersSection";
import AdminLogsSection from "@/modules/admin/AdminLogsSection";
import { TbFiles, TbUsers, TbBell, TbLayoutGrid, TbFileText } from "react-icons/tb";
import { MdDeleteSweep } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { securityLogger } from "@/utils/securityLogger";

const AdminDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"files" | "users" | "notifications" | "sliders" | "logs">(
    (tabParam === "files" || tabParam === "users" || tabParam === "sliders" || tabParam === "logs" ? tabParam : "notifications") as "files" | "users" | "notifications" | "sliders" | "logs"
  );
  const [cleaning, setCleaning] = useState(false);
  const [creatingTestFiles, setCreatingTestFiles] = useState(false);
  const hasLoggedInitialAccess = useRef(false);

  const user = useSelector((store: RootState) => store.user.user);
  const isAdmin = user?.role === "ADMIN";
  const isSubAdmin = user?.role === "SUBADMIN";

  const updateTab = (tab: "files" | "users" | "notifications" | "sliders" | "logs") => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/Admin?${params.toString()}`, { scroll: false });
  };

  // Helper function to log with tab context
  const logWithTab = async (action: string, details?: object) => {
    try {
      await securityLogger.logAdminAction(
        action,
        user?._id,
        user?.email,
        { ...details, tab: activeTab }
      );
    } catch (e) {
      // Ignore logging errors
    }
  };

  // Log initial admin panel access (only once)
  useEffect(() => {
    if (!hasLoggedInitialAccess.current && user?._id && user?.email) {
      hasLoggedInitialAccess.current = true;
      const tabParam = searchParams.get("tab") || "notifications";
      securityLogger.logAdminAction("admin_panel_access", user._id, user.email, { tab: tabParam }).catch(() => {});
    }
  }, [user, searchParams]);

  useEffect(() => {
    if (tabParam === "files" || tabParam === "users" || tabParam === "sliders" || (tabParam === "logs" && isAdmin)) {
      setActiveTab(tabParam as "files" | "users" | "sliders" | "logs");
    } else if (tabParam === "logs" && !isAdmin) {
      // If subadmin tries to access logs, redirect to notifications
      updateTab("notifications");
    } else if (!tabParam) {
      // If no tab in URL, set default and update URL
      updateTab("notifications");
    }
  }, [tabParam, isAdmin]);

  const handleCleanup = async () => {
    if (!isAdmin) {
      toast.error("فقط ادمین می‌تواند این عملیات را انجام دهد");
      securityLogger.logUnauthorizedAccess(
        "/Admin",
        user?._id,
        user?.email,
        "ADMIN"
      ).catch(() => {});
      return;
    }

    if (!confirm("آیا مطمئن هستید که می‌خواهید فایل‌های استفاده نشده را پاک کنید؟")) {
      return;
    }

    setCleaning(true);
    try {
      const response = await fetch("/api/admin/cleanup-unused-files", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `پاکسازی انجام شد: ${data.deleted} فایل حذف شد (${data.freedSpaceMB} مگابایت آزاد شد)`
        );
        // Log admin action
        logWithTab("cleanup_unused_files", { deleted: data.deleted, freedSpaceMB: data.freedSpaceMB });
      } else {
        toast.error(data.error || "خطا در پاکسازی");
      }
    } catch (error) {
      console.error("Cleanup error:", error);
      toast.error("خطا در پاکسازی فایل‌ها");
    } finally {
      setCleaning(false);
    }
  };

  const handleCreateTestFiles = async () => {
    if (!isAdmin) {
      toast.error("فقط ادمین می‌تواند این عملیات را انجام دهد");
      securityLogger.logUnauthorizedAccess(
        "/Admin",
        user?._id,
        user?.email,
        "ADMIN"
      ).catch(() => {});
      return;
    }

    if (!confirm("آیا مطمئن هستید که می‌خواهید 35 آگهی تستی ایجاد کنید؟")) {
      return;
    }

    setCreatingTestFiles(true);
    try {
      const response = await fetch("/api/admin/create-test-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 35 }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "آگهی‌های تستی با موفقیت ایجاد شدند");
        // Log admin action
        logWithTab("create_test_files", { count: 35 });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(data.error || "خطا در ایجاد آگهی‌های تستی");
      }
    } catch (error) {
      console.error("Create test files error:", error);
      toast.error("خطا در ایجاد آگهی‌های تستی");
    } finally {
      setCreatingTestFiles(false);
    }
  };

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
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <>
                      <button
                        onClick={handleCreateTestFiles}
                        disabled={creatingTestFiles}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {creatingTestFiles ? "در حال ایجاد..." : "ایجاد 35 آگهی تستی"}
                      </button>
                      <button
                        onClick={handleCleanup}
                        disabled={cleaning}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MdDeleteSweep className="text-lg" />
                        {cleaning ? "در حال پاکسازی..." : "پاکسازی فایل‌های استفاده نشده"}
                      </button>
                    </>
                  )}
          {isSubAdmin && (
            <span className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-md">
              حالت مشاهده فقط
            </span>
          )}
        </div>
      </div>
      
      <div className="flex gap-4 mb-6 border-b border-sky-400 dark:border-sky-800">
        <button
          onClick={() => updateTab("notifications")}
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
          onClick={() => updateTab("files")}
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
          onClick={() => updateTab("users")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            activeTab === "users"
              ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
              : "text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
          }`}
        >
          <TbUsers className="text-xl" />
          مدیریت کاربران
        </button>
        <button
          onClick={() => updateTab("sliders")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            activeTab === "sliders"
              ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
              : "text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
          }`}
        >
          <TbLayoutGrid className="text-xl" />
          اسلایدرهای صفحه اصلی
        </button>
        {isAdmin && (
          <button
            onClick={() => updateTab("logs")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
              activeTab === "logs"
                ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                : "text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
            }`}
          >
            <TbFileText className="text-xl" />
            لاگ‌های سیستم
          </button>
        )}
      </div>

      {activeTab === "notifications" && <AdminNotificationsSection />}
      {activeTab === "files" && <AdminFilesSection isAdmin={isAdmin} />}
      {activeTab === "users" && <AdminUsersSection isAdmin={isAdmin} />}
      {activeTab === "sliders" && <AdminSlidersSection isAdmin={isAdmin} />}
      {activeTab === "logs" && isAdmin && <AdminLogsSection />}
      <Toaster />
    </div>
  );
};

export default AdminDashboard;


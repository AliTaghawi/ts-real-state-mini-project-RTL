"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { MdFilePresent, MdPersonAdd, MdAdminPanelSettings } from "react-icons/md";
import { useRouter } from "next/navigation";

interface Notification {
  type: "file_pending" | "user_registered" | "subadmin_request";
  id: string;
  title: string;
  message: string;
  link: string;
  createdAt: string;
}

const AdminNotificationsSection = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      toast.error("خطا در دریافت اعلان‌ها");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "file_pending":
        return <MdFilePresent className="text-xl text-yellow-600 dark:text-yellow-400" />;
      case "user_registered":
        return <MdPersonAdd className="text-xl text-blue-600 dark:text-blue-400" />;
      case "subadmin_request":
        return <MdAdminPanelSettings className="text-xl text-purple-600 dark:text-purple-400" />;
      default:
        return null;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "file_pending":
        return "آگهی جدید";
      case "user_registered":
        return "کاربر جدید";
      case "subadmin_request":
        return "درخواست SUBADMIN";
      default:
        return "";
    }
  };

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">اعلان‌ها</h2>
        <button
          onClick={fetchNotifications}
          className="px-3 py-1.5 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors text-sm"
        >
          به‌روزرسانی
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          اعلانی وجود ندارد
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Link
              key={`${notification.type}-${notification.id}`}
              href={notification.link}
              className="block p-4 border border-sky-400 dark:border-sky-800 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-md">
                      {getNotificationBadge(notification.type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString("fa-ir", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{notification.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {notification.message}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsSection;


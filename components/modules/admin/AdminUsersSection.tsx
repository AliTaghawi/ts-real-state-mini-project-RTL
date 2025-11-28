"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { e2p } from "@/utils/replaceNumber";
import { MdBlock, MdCheckCircle, MdAdminPanelSettings, MdPerson } from "react-icons/md";

interface User {
  _id: string;
  email: string;
  showName?: string;
  fullName?: string;
  role: "USER" | "SUBADMIN" | "ADMIN";
  banned: boolean;
  subadminRequest?: boolean;
  createdAt: string;
}

const AdminUsersSection = ({ isAdmin }: { isAdmin: boolean }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "banned" | "active">("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setUsers(data.users || []);
      }
    } catch (error) {
      toast.error("خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, banned: boolean, role?: string, subadminRequest?: boolean) => {
    try {
      const body: any = { banned };
      if (role) body.role = role;
      if (subadminRequest !== undefined) body.subadminRequest = subadminRequest;
      
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        fetchUsers();
      }
    } catch (error) {
      toast.error("خطا در به‌روزرسانی وضعیت");
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: {
        icon: <MdAdminPanelSettings />,
        text: "مدیر",
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100 dark:bg-purple-900",
      },
      SUBADMIN: {
        icon: <MdAdminPanelSettings />,
        text: "مدیر فرعی",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-900",
      },
      USER: {
        icon: <MdPerson />,
        text: "کاربر",
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-100 dark:bg-gray-900",
      },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;

    return (
      <span
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm ${config.color} ${config.bg}`}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "banned") return Boolean(user.banned) === true;
    if (filter === "active") return Boolean(user.banned) === false;
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
          همه ({users.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "active"
              ? "bg-sky-500 text-white"
              : "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300"
          }`}
        >
          فعال ({users.filter((u) => !u.banned).length})
        </button>
        <button
          onClick={() => setFilter("banned")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "banned"
              ? "bg-sky-500 text-white"
              : "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300"
          }`}
        >
          مسدود شده ({users.filter((u) => u.banned).length})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-sky-400 dark:border-sky-800">
              <th className="text-right p-3">نام</th>
              <th className="text-right p-3">ایمیل</th>
              <th className="text-right p-3">نقش</th>
              <th className="text-right p-3">وضعیت</th>
              <th className="text-right p-3">تاریخ عضویت</th>
              <th className="text-right p-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950/30"
              >
                <td className="p-3">
                  {e2p(user.showName || user.fullName || "نامشخص")}
                </td>
                <td className="p-3 text-sm">{e2p(user.email)}</td>
                <td className="p-3">{getRoleBadge(user.role)}</td>
                <td className="p-3">
                  {user.banned ? (
                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <MdBlock /> مسدود
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <MdCheckCircle /> فعال
                    </span>
                  )}
                </td>
                <td className="p-3 text-sm">
                  {new Date(user.createdAt).toLocaleDateString("fa-ir")}
                </td>
                <td className="p-3">
                  <div className="flex flex-col gap-2">
                    {user.subadminRequest && user.role === "USER" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateUserStatus(user._id, user.banned, undefined, true)}
                          disabled={!isAdmin}
                          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                            isAdmin
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed opacity-50"
                          }`}
                        >
                          تایید درخواست SUBADMIN
                        </button>
                        <button
                          onClick={() => updateUserStatus(user._id, user.banned, undefined, false)}
                          disabled={!isAdmin}
                          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                            isAdmin
                              ? "bg-gray-500 text-white hover:bg-gray-600"
                              : "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed opacity-50"
                          }`}
                        >
                          رد درخواست
                        </button>
                      </div>
                    )}
                    {user.role !== "ADMIN" && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => updateUserStatus(user._id, !user.banned)}
                          disabled={!isAdmin}
                          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                            isAdmin
                              ? user.banned
                                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                : "bg-red-500 text-white hover:bg-red-600"
                              : "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed opacity-50"
                          }`}
                        >
                          {user.banned ? "رفع مسدودیت" : "مسدود کردن"}
                        </button>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            updateUserStatus(user._id, user.banned, e.target.value)
                          }
                          disabled={!isAdmin}
                          className={`px-2 py-1.5 rounded-md border border-sky-400 dark:border-sky-800 bg-white dark:bg-gray-900 text-sm ${
                            !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <option value="USER">کاربر</option>
                          <option value="SUBADMIN">مدیر فرعی</option>
                        </select>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          کاربری یافت نشد
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default AdminUsersSection;


"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdRefresh, MdFilterList } from "react-icons/md";

interface Log {
  _id: string;
  level: "error" | "warn" | "info" | "debug";
  message: string;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
  user?: {
    userId?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
  };
  request?: {
    method?: string;
    url?: string;
    path?: string;
    referer?: string;
  };
  context?: {
    page?: string;
    action?: string;
    component?: string;
  };
  timestamp: string;
  createdAt: string;
}

const AdminLogsSection = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    level: "",
    search: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      });

      if (filters.level) params.set("level", filters.level);
      if (filters.search) params.set("search", filters.search);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);

      const res = await fetch(`/api/logs?${params.toString()}`);
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        setLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      toast.error("خطا در دریافت لاگ‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOldLogs = async () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید لاگ‌های قدیمی را پاک کنید؟")) {
      return;
    }

    const days = prompt("لاگ‌های قدیمی‌تر از چند روز را پاک کنیم؟ (پیش‌فرض: 30)", "30");
    if (!days) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/logs?days=${days}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.deletedCount} لاگ حذف شد`);
        fetchLogs();
      }
    } catch (error) {
      toast.error("خطا در حذف لاگ‌ها");
    } finally {
      setDeleting(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-500 text-white";
      case "warn":
        return "bg-yellow-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      case "debug":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const persianDate = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
    
    const gregorianDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
    
    return { persian: persianDate, gregorian: gregorianDate };
  };

  if (loading && logs.length === 0) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">لاگ‌های سیستم</h3>
        <div className="flex gap-2">
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
          >
            <MdRefresh className="text-lg" />
            بروزرسانی
          </button>
          <button
            onClick={handleDeleteOldLogs}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <MdDelete className="text-lg" />
            {deleting ? "در حال حذف..." : "حذف لاگ‌های قدیمی"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-sky-50 dark:bg-sky-950 p-4 rounded-lg space-y-3">
        <div className="flex items-center gap-2">
          <MdFilterList className="text-xl" />
          <span className="font-semibold">فیلترها</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
              سطح لاگ
            </label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="w-full px-3 py-2 border-2 border-sky-400 dark:border-sky-800 rounded-md bg-white dark:bg-gray-900 text-sm"
            >
              <option value="">همه سطوح</option>
              <option value="error">خطا</option>
              <option value="warn">هشدار</option>
              <option value="info">اطلاعات</option>
              <option value="debug">دیباگ</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
              جستجو
            </label>
            <input
              type="text"
              placeholder="جستجو در پیام‌ها..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-3 py-2 border-2 border-sky-400 dark:border-sky-800 rounded-md bg-white dark:bg-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
              از تاریخ
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border-2 border-sky-400 dark:border-sky-800 rounded-md bg-white dark:bg-gray-900 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
              تا تاریخ
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border-2 border-sky-400 dark:border-sky-800 rounded-md bg-white dark:bg-gray-900 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-sky-400 dark:border-sky-800">
          <thead>
            <tr className="bg-sky-100 dark:bg-sky-900">
              <th className="border border-sky-400 dark:border-sky-800 p-2 text-right">زمان</th>
              <th className="border border-sky-400 dark:border-sky-800 p-2 text-right">سطح</th>
              <th className="border border-sky-400 dark:border-sky-800 p-2 text-right">پیام</th>
              <th className="border border-sky-400 dark:border-sky-800 p-2 text-right">صفحه</th>
              <th className="border border-sky-400 dark:border-sky-800 p-2 text-right">کاربر</th>
              <th className="border border-sky-400 dark:border-sky-800 p-2 text-right">جزئیات</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log._id}
                className="hover:bg-sky-50 dark:hover:bg-sky-950/50"
              >
                <td className="border border-sky-400 dark:border-sky-800 p-2 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-700 dark:text-gray-300">{formatDate(log.timestamp).persian}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({formatDate(log.timestamp).gregorian})</span>
                  </div>
                </td>
                <td className="border border-sky-400 dark:border-sky-800 p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(
                      log.level
                    )}`}
                  >
                    {log.level}
                  </span>
                </td>
                <td className="border border-sky-400 dark:border-sky-800 p-2 text-sm max-w-md truncate">
                  {log.message}
                </td>
                <td className="border border-sky-400 dark:border-sky-800 p-2 text-sm">
                  {log.context?.page || log.request?.path || "-"}
                </td>
                <td className="border border-sky-400 dark:border-sky-800 p-2 text-sm">
                  {log.user?.email || log.user?.userId || "-"}
                </td>
                <td className="border border-sky-400 dark:border-sky-800 p-2">
                  <details className="cursor-pointer">
                    <summary className="text-sky-600 dark:text-sky-400 text-sm">
                      مشاهده
                    </summary>
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs space-y-1">
                      {log.error && (
                        <div>
                          <strong>خطا:</strong> {log.error.name} - {log.error.message}
                          {log.error.stack && (
                            <pre className="mt-1 whitespace-pre-wrap text-xs">
                              {log.error.stack}
                            </pre>
                          )}
                        </div>
                      )}
                      {log.request && (
                        <div>
                          <strong>درخواست:</strong> {log.request.method} {log.request.url}
                          {log.request.referer && (
                            <div>
                              <strong>از صفحه:</strong> {log.request.referer}
                            </div>
                          )}
                        </div>
                      )}
                      {log.user && (
                        <div>
                          <strong>IP:</strong> {log.user.ip}
                          {log.user.userAgent && (
                            <div>
                              <strong>User Agent:</strong> {log.user.userAgent}
                            </div>
                          )}
                        </div>
                      )}
                      {log.context && (
                        <div>
                          <strong>کامپوننت:</strong> {log.context.component}
                          {log.context.action && (
                            <div>
                              <strong>عمل:</strong> {log.context.action}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border-2 border-sky-400 dark:border-sky-800 rounded-md disabled:opacity-50"
          >
            قبلی
          </button>
          <span className="px-3 py-1">
            صفحه {page} از {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border-2 border-sky-400 dark:border-sky-800 rounded-md disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      )}

      {logs.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          هیچ لاگی یافت نشد
        </div>
      )}
    </div>
  );
};

export default AdminLogsSection;


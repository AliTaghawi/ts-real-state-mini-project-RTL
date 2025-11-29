"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RejectEmailPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [rejected, setRejected] = useState(false);
  const token = searchParams.get("token");

  const rejectEmail = async () => {
    if (!token) {
      toast.error("لینک نامعتبر است");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/auth/reject-email?token=${token}`, {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در لغو ثبت نام");
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(data.message || "ثبت نام با موفقیت لغو شد");
      setRejected(true);
    } catch (error) {
      console.error("Error rejecting email:", error);
      toast.error("خطا در لغو ثبت نام. لطفا دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      rejectEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
            لینک نامعتبر است
          </h2>
          <Link
            href="/register"
            className="text-sky-600 dark:text-sky-400 hover:underline"
          >
            بازگشت به صفحه ثبت نام
          </Link>
        </div>
      </div>
    );
  }

  if (rejected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
              ثبت نام لغو شد
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ثبت نام با این ایمیل لغو شد و ایمیل آزاد شد. اگر می‌خواهید دوباره ثبت نام کنید، می‌توانید از صفحه ثبت نام استفاده کنید.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-center"
            >
              ثبت نام مجدد
            </Link>
            <Link
              href="/"
              className="px-6 py-2 border border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950 rounded-lg transition-colors text-center"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        {loading ? (
          <>
            <h2 className="text-2xl font-bold mb-4">در حال لغو ثبت نام...</h2>
            <p className="text-gray-600 dark:text-gray-400">لطفا صبر کنید</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">لغو ثبت نام</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              در حال پردازش درخواست...
            </p>
          </>
        )}
      </div>
    </div>
  );
}


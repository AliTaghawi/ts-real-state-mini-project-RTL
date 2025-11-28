"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { BiErrorCircle, BiHome, BiRefresh } from "react-icons/bi";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const hasLogged = useRef(false);

  useEffect(() => {
    // Prevent duplicate logging in React Strict Mode
    if (hasLogged.current) return;
    hasLogged.current = true;

    // Log error to database via API
    const logError = async () => {
      try {
        await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            level: "error",
            message: error.message || "Unknown error",
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
            context: {
              page: typeof window !== "undefined" ? window.location.pathname : "unknown",
              action: "page_error",
              component: "ErrorBoundary",
            },
            request: {
              url: typeof window !== "undefined" ? window.location.href : undefined,
              path: typeof window !== "undefined" ? window.location.pathname : undefined,
              referer: typeof document !== "undefined" ? document.referrer : undefined,
            },
          }),
        });
      } catch (err) {
        console.error("Failed to log error:", err);
      }
    };
    
    logError();
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 bg-gradient-to-br from-sky-50 py-10 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center max-w-2xl w-full">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400 dark:bg-red-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-orange-600 dark:from-red-600 dark:to-orange-700 p-8 rounded-full shadow-2xl">
              <BiErrorCircle className="text-8xl text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          مشکلی پیش آمده!
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          متأسفانه خطایی در برنامه رخ داده است. لطفاً دوباره تلاش کنید.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <BiRefresh className="text-xl" />
            <span>تلاش مجدد</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 border-2 border-sky-400 dark:border-sky-600 bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 font-semibold rounded-lg transition-all hover:scale-105 hover:bg-sky-50 dark:hover:bg-sky-950"
          >
            <BiHome className="text-xl" />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2 opacity-20">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}


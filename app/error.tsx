"use client";

import { useEffect } from "react";
import { logger } from "@/utils/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to database
    logger.error({
      message: error.message || "Unknown error",
      error: error,
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
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">مشکلی پیش آمده!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error.message || "خطای ناشناخته"}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}


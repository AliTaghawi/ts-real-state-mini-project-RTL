"use client";

import { useState } from "react";
import Link from "next/link";
import { BiErrorCircle } from "react-icons/bi";
import { TbFileText } from "react-icons/tb";

export default function TestErrorClient() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("این یک خطای تستی است برای نمایش صفحه Error");
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full p-8 border-2 border-sky-400 dark:border-sky-800 rounded-lg bg-sky-50 dark:bg-sky-950">
        <div className="mb-6 flex justify-center">
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-600 dark:to-blue-700 p-6 rounded-full">
            <BiErrorCircle className="text-6xl text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          صفحه تست خطا
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          با کلیک روی دکمه زیر، یک خطا ایجاد می‌شود و صفحه Error نمایش داده می‌شود.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShouldError(true)}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg"
          >
            ایجاد خطا
          </button>
          <Link
            href="/Admin?tab=logs"
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-sky-400 dark:border-sky-600 bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 font-semibold rounded-lg transition-all hover:scale-105 hover:bg-sky-50 dark:hover:bg-sky-950"
          >
            <TbFileText className="text-xl" />
            <span>مشاهده لاگ‌های سیستم</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


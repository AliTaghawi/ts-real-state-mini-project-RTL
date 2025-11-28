import Link from "next/link";
import { BiHome, BiErrorCircle } from "react-icons/bi";
import { MdSearch } from "react-icons/md";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "صفحه یافت نشد - 404 - Real State",
  description: "صفحه مورد نظر یافت نشد. لطفاً به صفحه اصلی بازگردید یا از جستجوی آگهی‌ها استفاده کنید.",
};

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 bg-gradient-to-br from-sky-50 py-10 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center max-w-2xl w-full">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-400 dark:bg-sky-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-600 dark:to-blue-700 p-8 rounded-full shadow-2xl">
              <BiErrorCircle className="text-8xl text-white" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold text-sky-600 dark:text-sky-400 mb-4 drop-shadow-lg">
          404
        </h1>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          صفحه مورد نظر یافت نشد
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <BiHome className="text-xl" />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
          <Link
            href="/property-files"
            className="flex items-center gap-2 px-6 py-3 border-2 border-sky-400 dark:border-sky-600 bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 font-semibold rounded-lg transition-all hover:scale-105 hover:bg-sky-50 dark:hover:bg-sky-950"
          >
            <MdSearch className="text-xl" />
            <span>جستجوی آگهی‌ها</span>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2 opacity-20">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}


import { BiLoaderAlt } from "react-icons/bi";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 bg-gradient-to-br from-sky-50 py-10 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        {/* Loading Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-400 dark:bg-sky-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-600 dark:to-blue-700 p-8 rounded-full shadow-2xl">
              <BiLoaderAlt className="text-8xl text-white animate-spin" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          در حال بارگذاری...
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          لطفاً صبر کنید
        </p>

        {/* Loading Dots */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}


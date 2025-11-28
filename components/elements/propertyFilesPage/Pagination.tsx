"use client";

import Link from "next/link";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  queryParams: string;
}

const Pagination = ({ currentPage, totalPages, queryParams }: PaginationProps) => {
  const getPageUrl = (page: number) => {
    if (!queryParams || queryParams.trim() === "") {
      return `/property-files?page=${page}`;
    }
    try {
      const params = new URLSearchParams(queryParams);
      params.set("page", page.toString());
      return `/property-files?${params.toString()}`;
    } catch (error) {
      return `/property-files?page=${page}`;
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // اگر تعداد صفحات کم است، همه را نشان بده
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // همیشه صفحه اول را نشان بده
      pages.push(1);

      // اگر صفحه فعلی از 3 بیشتر است، سه نقطه اضافه کن
      if (currentPage > 3) {
        pages.push("...");
      }

      // صفحات اطراف صفحه فعلی (حداکثر 3 صفحه: قبلی، فعلی، بعدی)
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        // اگر صفحه اول یا آخر نباشد
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      // اگر صفحه فعلی از totalPages - 2 کمتر است، سه نقطه اضافه کن
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // همیشه صفحه آخر را نشان بده
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {/* دکمه قبلی */}
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center justify-center py-0.5 px-3 border-2 border-sky-400 dark:border-sky-800 rounded-md hover:bg-sky-50 dark:hover:bg-sky-950 bg-white dark:bg-gray-900 text-sky-600 dark:text-sky-400 transition ease-linear min-w-[36px] h-[32px]"
        >
          <BiRightArrowAlt className="text-xl" />
        </Link>
      )}

      {/* شماره صفحات */}
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sky-600 dark:text-sky-400 flex items-center h-[32px]"
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Link
            key={pageNum}
            href={getPageUrl(pageNum)}
            className={`py-0.5 px-3 border-2 rounded-md transition ease-linear text-sm sm:text-base bg-white dark:bg-gray-900 min-w-[36px] h-[32px] flex items-center justify-center ${
              isActive
                ? "border-sky-500 dark:border-sky-600 bg-sky-50 dark:bg-sky-900 text-sky-600 dark:text-sky-400 font-semibold"
                : "border-sky-400 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950 text-sky-600 dark:text-sky-400"
            }`}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* دکمه بعدی */}
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center justify-center py-0.5 px-3 border-2 border-sky-400 dark:border-sky-800 rounded-md hover:bg-sky-50 dark:hover:bg-sky-950 bg-white dark:bg-gray-900 text-sky-600 dark:text-sky-400 transition ease-linear min-w-[36px] h-[32px]"
        >
          <BiLeftArrowAlt className="text-xl" />
        </Link>
      )}
    </div>
  );
};

export default Pagination;


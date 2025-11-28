"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SortSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      setSortBy(sortParam);
    } else {
      setSortBy("newest");
    }
  }, [searchParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSortBy(newSort);

    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    
    // Reset to page 1 when sorting changes
    params.delete("page");

    router.push(`/property-files?${params.toString()}`);
  };

  const sortOptions = [
    { value: "newest", label: "جدیدترین" },
    { value: "oldest", label: "قدیمی‌ترین" },
    { value: "price-high", label: "گران‌ترین" },
    { value: "price-low", label: "ارزان‌ترین" },
    { value: "area-high", label: "بزرگ‌ترین متراژ" },
    { value: "area-low", label: "کوچک‌ترین متراژ" },
  ];

  return (
    <div className="flex items-center gap-2 mb-4">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        مرتب‌سازی بر اساس:
      </label>
      <select
        id="sort"
        value={sortBy}
        onChange={handleSortChange}
        className="py-0.5 px-2 border-2 border-sky-400 dark:border-sky-800 rounded-md bg-white dark:bg-gray-900 text-sky-600 dark:text-sky-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition ease-linear h-[32px]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelect;


"use client";

import Link from "next/link";
import { categoryIcons, categoryText } from "@/utils/constants";
import Image from "next/image";

const CategoriesSection = () => {
  const categories = [
    { key: "apartment", image: "/img/apartment.png" },
    { key: "villa", image: "/img/villa.png" },
    { key: "store", image: "/img/store.png" },
    { key: "office", image: "/img/office.png" },
    { key: "land", image: "/img/land.png" }, // Using villa image as placeholder for land
  ] as const;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">دسته‌بندی‌ها</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((category) => {
          const categoryKey = category.key as keyof typeof categoryText;
          return (
            <Link
              key={category.key}
              href={`/property-files?category=${category.key}`}
              className="relative flex flex-col items-center justify-center gap-3 p-6 border border-sky-400 dark:border-sky-800 rounded-xl shadow-md dark:shadow-sky-950 hover:shadow-lg dark:hover:shadow-sky-900 transition-all hover:scale-105 overflow-hidden min-h-[180px] sm:min-h-[200px]"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={category.image}
                  alt={categoryText[categoryKey]}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
              </div>
              <div className="flex items-center gap-2 relative z-10 text-white drop-shadow-lg">
                {categoryIcons[categoryKey]}
                <span className="font-semibold text-sm sm:text-base">
                  {categoryText[categoryKey]}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSection;


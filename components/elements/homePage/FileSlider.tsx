"use client";

import { FrontFileType } from "@/models/RSFile";
import FileCard from "@/modules/FileCard";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

interface FileSliderProps {
  title: string;
  files: FrontFileType[];
  viewAllLink?: string;
  categoryType?: string;
}

const FileSlider = ({ title, files, viewAllLink, categoryType }: FileSliderProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const hasScroll = scrollWidth > clientWidth;
      
      if (!hasScroll) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }
      
      // در RTL، scrollLeft می‌تواند منفی باشد
      // scrollLeft = 0 در ابتدا
      // scrollLeft منفی می‌شود وقتی به راست اسکرول می‌کنیم
      const minScroll = -(scrollWidth - clientWidth);
      setCanScrollLeft(hasScroll && scrollLeft < 0);
      setCanScrollRight(hasScroll && scrollLeft > minScroll);
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
      
      // چک مجدد بعد از رندر
      setTimeout(checkScrollability, 100);
    }
    
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      }
    };
  }, [files]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      // در RTL، جهت را برعکس می‌کنیم
      const newScroll =
        direction === "right"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="اسکرول به چپ"
          >
            <BiRightArrowAlt className="text-xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="اسکرول به راست"
          >
            <BiLeftArrowAlt className="text-xl" />
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 items-stretch scroll-smooth ps-4 pe-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollBehavior: "smooth" }}
      >
        {files.slice(0, 10).map((file: any) => (
          <div key={file._id} className="flex-shrink-0 w-[300px] sm:w-[350px] flex">
            <div className="w-full">
            <FileCard file={JSON.parse(JSON.stringify(file))} />
            </div>
          </div>
        ))}
        {viewAllLink && (
          <div className="flex-shrink-0 w-[300px] sm:w-[350px] flex">
            <Link
              href={viewAllLink}
              className="w-full flex flex-col items-center justify-center gap-4 p-4 border border-sky-400 dark:border-sky-800 rounded-xl shadow-md dark:shadow-sky-950 hover:shadow-lg dark:hover:shadow-sky-900 transition-all hover:scale-105 h-full bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950 dark:to-blue-950"
            >
              <div className="flex flex-col items-center justify-center gap-4 h-full">
                <div className="p-5 rounded-full bg-sky-500 dark:bg-sky-600 shadow-lg">
                  <BiLeftArrowAlt className="text-5xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-sky-700 dark:text-sky-300">مشاهده همه</h3>
                <p className="text-sm text-sky-600 dark:text-sky-400 text-center px-4">
                  {categoryType ? `مشاهده تمام آگهی‌های ${categoryType}` : "مشاهده تمام آگهی‌ها"}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileSlider;


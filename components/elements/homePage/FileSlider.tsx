"use client";

import { FrontFileType } from "@/models/RSFile";
import FileCard from "@/modules/FileCard";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { useRef, useState, useEffect } from "react";

interface FileSliderProps {
  title: string;
  files: FrontFileType[];
}

const FileSlider = ({ title, files }: FileSliderProps) => {
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
        {files.map((file: any) => (
          <div key={file._id} className="flex-shrink-0 w-[300px] sm:w-[350px] flex">
            <div className="w-full">
            <FileCard file={JSON.parse(JSON.stringify(file))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileSlider;


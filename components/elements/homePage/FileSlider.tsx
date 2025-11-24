"use client";

import { FrontFileType } from "@/models/RSFile";
import FileCard from "@/modules/FileCard";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { useRef } from "react";

interface FileSliderProps {
  title: string;
  files: FrontFileType[];
}

const FileSlider = ({ title, files }: FileSliderProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll =
        direction === "right"
          ? currentScroll + scrollAmount
          : currentScroll - scrollAmount;
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
            className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors"
            aria-label="Scroll left"
          >
            <BiRightArrowAlt className="text-xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors"
            aria-label="Scroll right"
          >
            <BiLeftArrowAlt className="text-xl" />
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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


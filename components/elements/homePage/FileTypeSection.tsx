"use client";

import Link from "next/link";
import { fileTypesText } from "@/utils/constants";
import { MdHome, MdSell, MdAccountBalance } from "react-icons/md";

const FileTypeSection = () => {
  const fileTypes: Array<keyof typeof fileTypesText> = ["rent", "mortgage", "buy"];

  const fileTypeIcons = {
    rent: <MdHome className="text-xl text-sky-500" />,
    mortgage: <MdAccountBalance className="text-xl text-sky-500" />,
    buy: <MdSell className="text-xl text-sky-500" />,
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">نوع آگهی</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {fileTypes.map((fileType) => (
          <Link
            key={fileType}
            href={`/property-files?fileType=${fileType}`}
            className="flex items-center gap-2 px-6 py-3 border-2 border-sky-400 dark:border-sky-600 rounded-lg bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 font-semibold transition-all hover:scale-105 hover:shadow-md dark:hover:shadow-sky-900"
          >
            {fileTypeIcons[fileType]}
            <span>{fileTypesText[fileType]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FileTypeSection;


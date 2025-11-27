"use client";

import { useState, useRef } from "react";
import { MdDelete, MdCloudUpload } from "react-icons/md";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

const ImageUpload = ({ images, onChange, error }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Limit to 10 images
    if (images.length + files.length > 10) {
      alert("حداکثر 10 تصویر می‌توانید آپلود کنید");
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert(`فایل ${file.name} یک تصویر نیست`);
          continue;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`فایل ${file.name} بزرگتر از 5 مگابایت است`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.url) {
          newImages.push(data.url);
        } else {
          alert(`خطا در آپلود ${file.name}: ${data.error || "خطای ناشناخته"}`);
        }
      }

      onChange([...images, ...newImages]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("خطا در آپلود تصاویر");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    // فقط از state حذف می‌کنیم، فایل فیزیکی بعد از ثبت تغییرات حذف می‌شود
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="w-full max-w-[390px]">
      <label className="block text-sm font-medium mb-2">تصاویر:</label>
      <div className="space-y-4">
        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading || images.length >= 10}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= 10}
            className="w-full py-2 px-4 border-2 border-dashed border-sky-400 dark:border-sky-600 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MdCloudUpload className="text-xl text-sky-500" />
            <span>
              {uploading
                ? "در حال آپلود..."
                : images.length >= 10
                ? "حداکثر 10 تصویر"
                : "افزودن تصویر"}
            </span>
          </button>
          {images.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {images.length} / 10 تصویر
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 group"
              >
                <Image
                  src={url}
                  alt={`تصویر ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="حذف تصویر"
                >
                  <MdDelete className="text-lg" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;


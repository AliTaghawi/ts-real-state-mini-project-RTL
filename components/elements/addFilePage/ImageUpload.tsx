"use client";

import { useState, useRef, useEffect } from "react";
import { MdDelete, MdCloudUpload } from "react-icons/md";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB

const ImageUpload = ({ images, onChange, error }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [imageSizes, setImageSizes] = useState<{ [url: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // محاسبه حجم کل تصاویر موجود
  useEffect(() => {
    const fetchExistingSizes = async () => {
      if (images.length === 0) {
        setTotalSize(0);
        setImageSizes({});
        return;
      }

      try {
        const response = await fetch("/api/files/upload/size", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrls: images }),
        });

        if (response.ok) {
          const data = await response.json();
          const newSizes = data.sizes || {};
          
          // به‌روزرسانی imageSizes - فقط تصاویری که در images هستند
          const cleaned: { [url: string]: number } = {};
          images.forEach((img) => {
            if (newSizes[img]) {
              cleaned[img] = newSizes[img];
            }
          });
          setImageSizes(cleaned);
          
          // محاسبه حجم کل
          setTotalSize(data.totalSize || 0);
        }
      } catch (error) {
        console.error("Error fetching image sizes:", error);
      }
    };

    fetchExistingSizes();
  }, [images]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Limit to 10 images
    if (images.length + files.length > 10) {
      alert("حداکثر 10 تصویر می‌توانید آپلود کنید");
      return;
    }

    // محاسبه حجم فایل‌های جدید
    let newFilesTotalSize = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(`فایل ${file.name} یک تصویر نیست`);
        return;
      }

      // Validate file size (5MB per file)
      if (file.size > 5 * 1024 * 1024) {
        alert(`فایل ${file.name} بزرگتر از 5 مگابایت است`);
        return;
      }

      newFilesTotalSize += file.size;
    }

    // چک کردن محدودیت حجم کل (10MB)
    if (totalSize + newFilesTotalSize > MAX_TOTAL_SIZE) {
      const currentSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      const newSizeMB = (newFilesTotalSize / (1024 * 1024)).toFixed(2);
      alert(
        `مجموع حجم تصاویر نمی‌تواند بیشتر از 10 مگابایت باشد.\n` +
        `حجم فعلی: ${currentSizeMB} مگابایت\n` +
        `حجم فایل‌های جدید: ${newSizeMB} مگابایت\n` +
        `مجموع: ${((totalSize + newFilesTotalSize) / (1024 * 1024)).toFixed(2)} مگابایت`
      );
      return;
    }

    setUploading(true);
    const newImages: string[] = [];
    const newSizes: { [url: string]: number } = {};

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.url) {
          newImages.push(data.url);
          if (data.size) {
            newSizes[data.url] = data.size;
          }
        } else {
          alert(`خطا در آپلود ${file.name}: ${data.error || "خطای ناشناخته"}`);
        }
      }

      // به‌روزرسانی state
      setImageSizes((prev) => ({ ...prev, ...newSizes }));
      setTotalSize((prev) => prev + newFilesTotalSize);
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
    const imageToRemove = images[index];
    const newImages = images.filter((_, i) => i !== index);
    
    // به‌روزرسانی حجم کل
    if (imageToRemove && imageSizes[imageToRemove]) {
      setTotalSize((prev) => prev - imageSizes[imageToRemove]);
      setImageSizes((prev) => {
        const newSizes = { ...prev };
        delete newSizes[imageToRemove];
        return newSizes;
      });
    }
    
    onChange(newImages);
  };

  return (
    <div className="w-full max-w-[390px]">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">تصاویر:</label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          حداکثر 10 تصویر | مجموع حجم تصاویر حداکثر 10 مگابایت | هر تصویر حداکثر 5 مگابایت
        </p>
      </div>
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
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
              <p>{images.length} / 10 تصویر</p>
              <p className={totalSize > MAX_TOTAL_SIZE ? "text-red-500 dark:text-red-400" : ""}>
                حجم کل: {(totalSize / (1024 * 1024)).toFixed(2)} / 10 مگابایت
              </p>
            </div>
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


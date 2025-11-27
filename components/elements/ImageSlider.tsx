"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";

interface ImageSliderProps {
  images: string[];
  className?: string;
}

const ImageSlider = ({ images, className = "" }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Preload تصاویر مجاور
  useEffect(() => {
    const preloadImages = () => {
      const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      
      [prevIndex, nextIndex].forEach((index) => {
        if (images[index]) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = images[index];
          document.head.appendChild(link);
        }
      });
    };
    
    if (images.length > 0) {
      preloadImages();
    }
  }, [currentIndex, images]);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400 dark:text-gray-500 text-sm">بدون تصویر</span>
      </div>
    );
  }

  // در RTL: دکمه راست = تصویر قبلی (کاهش index)، دکمه چپ = تصویر بعدی (افزایش index)
  const goToRight = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToLeft = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`relative w-full h-48 rounded-lg overflow-hidden ${className}`}>
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ 
          transform: `translateX(${currentIndex * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <div 
            key={`${image}-${index}`} 
            className="h-full relative flex-shrink-0"
            style={{ width: '100%', minWidth: '100%' }}
          >
            <Image
              src={image}
              alt={`تصویر ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0 || index === currentIndex}
              loading={index === 0 || index === currentIndex ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={goToRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
            aria-label="تصویر قبلی"
          >
            <BiRightArrowAlt className="text-xl" />
          </button>
          <button
            onClick={goToLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
            aria-label="تصویر بعدی"
          >
            <BiLeftArrowAlt className="text-xl" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all border-2 ${
                  index === currentIndex
                    ? "bg-white w-6 h-2 border-white/80"
                    : "bg-white/60 hover:bg-white/80 w-2 h-2 border-white/40"
                }`}
                aria-label={`رفتن به تصویر ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;


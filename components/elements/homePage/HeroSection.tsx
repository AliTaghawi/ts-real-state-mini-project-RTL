"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BiLeftArrowAlt } from "react-icons/bi";
import { MdHome, MdSearch, MdVerified, MdStore, MdBusiness, MdLandscape } from "react-icons/md";
import { PiBuildingApartmentFill, PiOfficeChairFill } from "react-icons/pi";
import { categoryIcons, categoryText } from "@/utils/constants";

interface SlideData {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  link: string;
  image?: string;
  imagePosition?: "left" | "right";
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideData[] = [
    {
      title: "بازار املاک",
      subtitle: "پیدا کردن خانه رویایی شما، فقط یک کلیک فاصله دارد",
      description: "با هزاران آگهی معتبر و به‌روز، بهترین انتخاب را برای خرید، اجاره یا رهن ملک خود داشته باشید",
      icon: <MdHome className="text-3xl sm:text-4xl text-white" />,
      gradient: "from-sky-500 via-sky-600 to-blue-600 dark:from-sky-700 dark:via-sky-800 dark:to-blue-800",
      link: "/property-files",
    },
    {
      title: "آپارتمان‌های مدرن",
      subtitle: "خانه‌های آپارتمانی با بهترین امکانات",
      description: "از آپارتمان‌های کوچک و دنج تا پنت‌هاوس‌های لوکس، همه را در یکجا پیدا کنید",
      icon: <PiBuildingApartmentFill className="text-3xl sm:text-4xl text-white" />,
      gradient: "from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-700 dark:via-blue-800 dark:to-indigo-800",
      link: "/property-files?category=apartment",
      image: "/img/apartment.png",
      imagePosition: "left",
    },
    {
      title: "مغازه‌های پررونق",
      subtitle: "فضاهای تجاری در بهترین موقعیت‌ها",
      description: "مغازه‌های شیک و پررفتوآمد در مراکز خرید و خیابان‌های اصلی شهر",
      icon: <MdStore className="text-3xl sm:text-4xl text-white" />,
      gradient: "from-indigo-500 via-indigo-600 to-purple-600 dark:from-indigo-700 dark:via-indigo-800 dark:to-purple-800",
      link: "/property-files?category=store",
      image: "/img/store.png",
      imagePosition: "right",
    },
    {
      title: "دفترهای کاری",
      subtitle: "فضاهای اداری حرفه‌ای و مدرن",
      description: "دفترهای مجهز و مناسب برای کسب‌وکارهای کوچک و بزرگ",
      icon: <PiOfficeChairFill className="text-3xl sm:text-4xl text-white" />,
      gradient: "from-purple-500 via-purple-600 to-pink-600 dark:from-purple-700 dark:via-purple-800 dark:to-pink-800",
      link: "/property-files?category=office",
      image: "/img/office.png",
      imagePosition: "left",
    },
    {
      title: "ویلاها و زمین‌ها",
      subtitle: "ملک‌های لوکس و زمین‌های سرمایه‌گذاری",
      description: "ویلاهای مجلل و زمین‌های مناسب برای ساخت و سرمایه‌گذاری",
      icon: <MdLandscape className="text-3xl sm:text-4xl text-white" />,
      gradient: "from-emerald-500 via-emerald-600 to-teal-600 dark:from-emerald-700 dark:via-emerald-800 dark:to-teal-800",
      link: "/property-files?category=villa",
      image: "/img/villa.png",
      imagePosition: "right",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // هر 4 ثانیه

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative mb-16 overflow-hidden rounded-2xl shadow-xl h-[400px] sm:h-[450px] lg:h-[500px]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className={`h-full bg-gradient-to-br ${slide.gradient} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
            
            {/* Background Image */}
            {slide.image && (
              <div className="absolute inset-0">
                {slide.imagePosition === "left" && (
                  <div className="absolute left-0 top-0 bottom-0 w-3/4 sm:w-2/3 lg:w-1/2">
                    <div 
                      className="absolute inset-0"
                      style={{
                        maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 100%)'
                      }}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover object-left"
                        priority={index === currentSlide}
                      />
                    </div>
                  </div>
                )}
                {slide.imagePosition === "right" && (
                  <div className="absolute right-0 top-0 bottom-0 w-3/4 sm:w-2/3 lg:w-1/2">
                    <div 
                      className="absolute inset-0"
                      style={{
                        maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 100%)'
                      }}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover object-right"
                        priority={index === currentSlide}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="relative h-full px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 flex items-center z-10">
              <div className="max-w-4xl mx-auto text-center w-full">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {slide.icon}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                    {slide.title}
                  </h1>
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 drop-shadow-md">
                  {slide.subtitle}
                </p>
                <p className="text-base sm:text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  {slide.description}
                </p>
                {index === 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <MdSearch className="text-xl text-white" />
                      <span className="text-white font-semibold">جستجوی آسان</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <MdVerified className="text-xl text-white" />
                      <span className="text-white font-semibold">آگهی‌های معتبر</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <MdHome className="text-xl text-white" />
                      <span className="text-white font-semibold">تنوع بالا</span>
                    </div>
                  </div>
                )}
                <Link
                  href={slide.link}
                  className="inline-flex items-center gap-2 bg-white text-sky-600 dark:text-sky-700 font-bold px-8 py-4 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-100 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span>مشاهده آگهی‌ها</span>
                  <BiLeftArrowAlt className="text-xl" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all border-2 ${
              index === currentSlide
                ? "bg-white w-8 h-2 border-white/80"
                : "bg-white/60 hover:bg-white/80 w-2 h-2 border-white/40"
            }`}
            aria-label={`رفتن به اسلاید ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;


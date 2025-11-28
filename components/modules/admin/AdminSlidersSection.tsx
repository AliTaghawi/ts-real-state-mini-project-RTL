"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AdminSlidersSectionProps {
  isAdmin: boolean;
}

interface SliderSettings {
  newest: boolean;
  apartment: boolean;
  store: boolean;
  office: boolean;
  villaLand: boolean;
}

interface SectionSettings {
  hero: boolean;
  categories: boolean;
  fileTypes: boolean;
}

const AdminSlidersSection = ({ isAdmin }: AdminSlidersSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sliders, setSliders] = useState<SliderSettings>({
    newest: true,
    apartment: true,
    store: true,
    office: true,
    villaLand: true,
  });
  const [sections, setSections] = useState<SectionSettings>({
    hero: true,
    categories: true,
    fileTypes: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

          const fetchSettings = async () => {
            try {
              setLoading(true);
              const res = await fetch("/api/admin/settings");
              const data = await res.json();
              if (data.error) {
                toast.error(data.error);
              } else {
                if (data.settings?.homePageSliders) {
                  setSliders(data.settings.homePageSliders);
                }
                if (data.settings?.homePageSections) {
                  setSections(data.settings.homePageSections);
                }
              }
            } catch (error) {
              toast.error("خطا در دریافت تنظیمات");
            } finally {
              setLoading(false);
            }
          };

          const handleToggle = (key: keyof SliderSettings) => {
            setSliders((prev) => ({
              ...prev,
              [key]: !prev[key],
            }));
          };

          const handleSectionToggle = (key: keyof SectionSettings) => {
            setSections((prev) => ({
              ...prev,
              [key]: !prev[key],
            }));
          };

          const handleSave = async () => {
            try {
              setSaving(true);
              const res = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  homePageSliders: sliders,
                  homePageSections: sections,
                }),
              });

              const data = await res.json();
              if (data.error) {
                toast.error(data.error);
              } else {
                toast.success("تنظیمات با موفقیت ذخیره شد");
              }
            } catch (error) {
              toast.error("خطا در ذخیره تنظیمات");
            } finally {
              setSaving(false);
            }
          };

          const sliderLabels: { [key in keyof SliderSettings]: string } = {
            newest: "جدیدترین آگهی‌ها",
            apartment: "آپارتمان‌ها",
            store: "مغازه‌ها",
            office: "دفترها",
            villaLand: "ویلاها و زمین‌ها",
          };

          const sectionLabels: { [key in keyof SectionSettings]: string } = {
            hero: "بنر اصلی (اسلایدر)",
            categories: "بخش دسته‌بندی‌ها",
            fileTypes: "بخش نوع آگهی",
          };

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  const sliderKeys = Object.keys(sliderLabels) as Array<keyof SliderSettings>;
  const sectionKeys = Object.keys(sectionLabels) as Array<keyof SectionSettings>;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold mb-4">مدیریت بخش‌های صفحه اصلی</h3>
        <div className="space-y-3">
          {sectionKeys.map((key) => (
            <label
              key={key}
              className="flex items-center gap-3 p-3 border border-sky-400 dark:border-sky-800 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={sections[key] ?? false}
                onChange={() => handleSectionToggle(key)}
                disabled={!isAdmin}
                className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="font-medium">{sectionLabels[key]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold mb-4">مدیریت اسلایدرهای صفحه اصلی</h3>
        <div className="space-y-3">
          {sliderKeys.map((key) => (
            <label
              key={key}
              className="flex items-center gap-3 p-3 border border-sky-400 dark:border-sky-800 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={sliders[key] ?? false}
                onChange={() => handleToggle(key)}
                disabled={!isAdmin}
                className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="font-medium">{sliderLabels[key]}</span>
            </label>
          ))}
        </div>
      </div>

      {isAdmin ? (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
        </button>
      ) : (
        <div className="w-full py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-center font-medium">
          فقط مشاهده - فقط ادمین می‌تواند تغییرات را ذخیره کند
        </div>
      )}
    </div>
  );
};

export default AdminSlidersSection;


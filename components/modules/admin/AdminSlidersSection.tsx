"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface SliderSettings {
  newest: boolean;
  apartment: boolean;
  store: boolean;
  office: boolean;
  villaLand: boolean;
}

const AdminSlidersSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sliders, setSliders] = useState<SliderSettings>({
    newest: true,
    apartment: true,
    store: true,
    office: true,
    villaLand: true,
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
      } else if (data.settings?.homePageSliders) {
        setSliders(data.settings.homePageSliders);
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

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homePageSliders: sliders }),
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

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  // فقط keyهای تعریف شده در sliderLabels را نمایش می‌دهیم
  const sliderKeys = Object.keys(sliderLabels) as Array<keyof SliderSettings>;

  return (
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
              className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500"
            />
            <span className="font-medium">{sliderLabels[key]}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </div>
  );
};

export default AdminSlidersSection;


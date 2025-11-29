"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const VerifyEmailPage = ({ token }: { token?: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const verifyEmail = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/auth/verify-email?token=${token}`, {
        method: "GET",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error || "خطا در تایید ایمیل");
        return;
      }
      
      if (data.error) {
        toast.error(data.error);
        return;
      }
      
      toast.success(data.message || "ایمیل شما با موفقیت تایید شد");
      setVerified(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Error verifying email:", error);
      toast.error("خطا در تایید ایمیل. لطفا دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-sky-600 dark:text-sky-400">
            لطفا ایمیل خود را تایید کنید
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            یک ایمیل تایید به آدرس ایمیل شما ارسال شده است. لطفا صندوق ورودی خود را بررسی کنید و روی لینک تایید کلیک کنید.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            اگر ایمیل را دریافت نکرده‌اید، لطفا پوشه اسپم را نیز بررسی کنید.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-center"
            >
              ورود به حساب کاربری
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 border border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950 rounded-lg transition-colors text-center"
            >
              بازگشت به ثبت نام
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4 text-emerald-600">
          ایمیل شما با موفقیت تایید شد!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          در حال انتقال به صفحه ورود...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {loading ? (
        <>
          <h2 className="text-2xl font-bold mb-4">در حال تایید ایمیل...</h2>
          <p className="text-gray-600 dark:text-gray-400">لطفا صبر کنید</p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">تایید ایمیل</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            در حال تایید ایمیل شما...
          </p>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;


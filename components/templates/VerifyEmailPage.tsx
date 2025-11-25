"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const VerifyEmailPage = ({ token }: { token?: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/auth/verify-email?token=${token}`, {
        method: "GET",
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setVerified(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error("خطا در تایید ایمیل");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">لینک تایید نامعتبر است</h2>
        <Link
          href="/register"
          className="text-sky-600 dark:text-sky-400 hover:underline"
        >
          بازگشت به صفحه ثبت نام
        </Link>
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


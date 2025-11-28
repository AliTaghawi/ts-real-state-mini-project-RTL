import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/api/auth/config";
import LoginPage from "@/templates/LoginPage";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "ورود - Real State",
  description: "ورود به حساب کاربری Real State برای مدیریت آگهی‌های املاک",
};

async function Login() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");
  return <LoginPage />;
}

export default Login;

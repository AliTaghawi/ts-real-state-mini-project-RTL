import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import RegisterPage from "@/templates/RegisterPage";
import { authOptions } from "@/api/auth/config";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "ثبت نام - Real State",
  description: "ثبت نام در Real State و شروع به انتشار آگهی‌های املاک",
};

async function Register() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/")
  return <RegisterPage />;
}

export default Register;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/api/auth/config";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import TestErrorClient from "@/templates/TestErrorClient";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "تست خطا - Real State",
  description: "صفحه تست خطا برای ادمین",
};

export default async function TestErrorPage() {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const user = await RSUser.findOne({ email: session.user?.email });
  
  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return <TestErrorClient />;
}


import VerifyEmailPage from "@/templates/VerifyEmailPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/api/auth/config";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "تایید ایمیل - Real State",
  description: "تایید ایمیل حساب کاربری Real State",
};

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmail({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  const { token } = await searchParams;
  return <VerifyEmailPage token={token} />;
}


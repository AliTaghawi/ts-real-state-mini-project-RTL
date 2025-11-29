import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لغو ثبت نام - Real State",
  description: "لغو ثبت نام و آزادسازی ایمیل",
};

export default function RejectEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


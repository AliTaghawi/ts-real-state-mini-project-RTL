import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "لغو ثبت نام - Real State",
  description: "لغو ثبت نام و آزادسازی ایمیل",
};

export default function RejectEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrap children in a Suspense boundary because pages/components inside
  // might use client-side navigation hooks such as `useSearchParams` which
  // cause a CSR bailout and require a Suspense fallback to be present.
  return <Suspense fallback={<div />}>{children}</Suspense>;
}


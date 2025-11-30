import { ChildrenType } from "@/types/types";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import React, { Suspense } from "react";

function Layout({ children }: ChildrenType) {
  return (
    <div className="flex flex-col max-w-[1280px] mx-auto px-2 min-h-[100vh]">
      <Suspense fallback={<div />}>
        <Header />
      </Suspense>
      <main className="mb-auto">
        <Suspense fallback={<div />}>{children}</Suspense>
      </main>
      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default Layout;

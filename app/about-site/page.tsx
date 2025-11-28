import type { Metadata } from "next";
import AboutPage from "@/templates/AboutPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درباره من - Real State",
  description: "درباره توسعه‌دهنده این پروژه",
};

export default function AboutSite() {
  return <AboutPage />;
}
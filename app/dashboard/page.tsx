import DashboardPage from "@/templates/DashboardPage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "داشبورد - Real State",
  description: "مدیریت آگهی‌های املاک و تنظیمات حساب کاربری",
};

const Dashboard = () => {
  return (
    <DashboardPage />
  );
};

export default Dashboard;
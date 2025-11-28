import ChangePasswordPage from "@/templates/ChangePasswordPage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تغییر رمز عبور - Real State",
  description: "تغییر رمز عبور حساب کاربری در Real State",
};

const ChangePassword = () => {
  return (
    <ChangePasswordPage />
  );
};

export default ChangePassword;
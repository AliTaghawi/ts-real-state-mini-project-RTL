import EditProfilePage from "@/templates/EditProfilePage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ویرایش پروفایل - Real State",
  description: "ویرایش اطلاعات پروفایل کاربری در Real State",
};

const EditProfile = () => {
  return <EditProfilePage />;
};

export default EditProfile;

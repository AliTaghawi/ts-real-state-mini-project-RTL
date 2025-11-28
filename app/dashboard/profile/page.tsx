import ProfilePage from "@/templates/ProfilePage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پروفایل کاربری - Real State",
  description: "مشاهده و مدیریت پروفایل کاربری در Real State",
};

const Profile = () => {
  return <ProfilePage />;
};

export default Profile;

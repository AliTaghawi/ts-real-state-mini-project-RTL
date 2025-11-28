import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import RSFile from "@/models/RSFile";
import { notFound } from "next/navigation";
import UserProfilePage from "@/templates/UserProfilePage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
  try {
    await connectDB();
    const { userId } = await params;
    const user = await RSUser.findById(userId)
      .select("showName fullName")
      .lean<{ showName?: string; fullName?: string } | null>();
    
    if (!user) {
      return {
        title: "پروفایل کاربر - Real State",
        description: "پروفایل کاربر یافت نشد",
      };
    }

    const userName = user.fullName || user.showName || "کاربر";
    return {
      title: `پروفایل ${userName} - Real State`,
      description: `مشاهده پروفایل و آگهی‌های ${userName} در Real State`,
    };
  } catch (error) {
    return {
      title: "پروفایل کاربر - Real State",
      description: "مشاهده پروفایل کاربر",
    };
  }
}

const UserProfile = async ({ params }: { params: Promise<{ userId: string }> }) => {
  try {
    await connectDB();
    const { userId } = await params;

    const user = await RSUser.findById(userId).select("-password").lean();
    if (!user) notFound();

    // Get user's published files
    const files = await RSFile.find({
      userId: userId,
      published: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Check if current user is admin
    const session = await getServerSession(authOptions);
    let isAdmin = false;
    let isCurrentUser = false;
    if (session) {
      const currentUser = await RSUser.findOne({ email: session.user?.email });
      isAdmin = currentUser?.role === "ADMIN";
      isCurrentUser = currentUser?._id.toString() === userId;
    }

    return (
      <UserProfilePage
        user={JSON.parse(JSON.stringify(user))}
        files={JSON.parse(JSON.stringify(files))}
        isAdmin={isAdmin}
        isCurrentUser={isCurrentUser}
      />
    );
  } catch (error) {
    console.error("Error in UserProfile page:", error);
    throw error;
  }
};

export default UserProfile;


import connectDB from "@/utils/connectDB";
import RSFile, { FileType } from "@/models/RSFile";
import RSUser from "@/models/RSUser";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";
import FileDetailsPage from "@/templates/FileDetailsPage";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ fileId: string }> }): Promise<Metadata> {
  try {
    await connectDB();
    const { fileId } = await params;
    const file = await RSFile.findOne({ _id: fileId }).lean();
    
    if (!file) {
      return {
        title: "آگهی یافت نشد - Real State",
        description: "آگهی مورد نظر یافت نشد",
      };
    }

    const fileData = file as unknown as FileType;
    const title = fileData.title || "آگهی املاک";
    const description = fileData.description 
      ? fileData.description.substring(0, 160) 
      : `مشاهده جزئیات آگهی ${title} در Real State`;

    return {
      title: `${title} - Real State`,
      description,
    };
  } catch (error) {
    return {
      title: "جزئیات آگهی - Real State",
      description: "مشاهده جزئیات آگهی املاک",
    };
  }
}

const FileDetails = async ({ params }: { params: Promise<{ fileId: string }> }) => {
  try {
    await connectDB();
    const { fileId } = await params;
    const file = await RSFile.findOne({ _id: fileId }).lean();
    if (!file) notFound();

    // Check if user is admin or subadmin
    const session = await getServerSession(authOptions);
    let isAdmin = false;
    let isSubAdmin = false;
    let isOwner = false;
    if (session) {
      const user = await RSUser.findOne({ email: session.user?.email });
      isAdmin = user?.role === "ADMIN";
      isSubAdmin = user?.role === "SUBADMIN";
      // بررسی اینکه آیا فایل متعلق به کاربر فعلی است
      const fileWithUserId = file as unknown as FileType;
      isOwner = user?._id.toString() === fileWithUserId.userId?.toString();
    }

    // Non-admins and non-subadmins can only view published files
    const fileWithType = file as unknown as FileType;
    if (!isAdmin && !isSubAdmin && fileWithType.published !== true) {
      notFound();
    }

    // تبدیل Mongoose document به plain object برای Client Component
    const fileData = JSON.parse(JSON.stringify(file));

    return (
      <FileDetailsPage file={fileData} isAdmin={isAdmin} isSubAdmin={isSubAdmin} isOwner={isOwner} />
    );
  } catch (error) {
    console.error("Error in FileDetails page:", error);
    throw error;
  }
};

export default FileDetails;
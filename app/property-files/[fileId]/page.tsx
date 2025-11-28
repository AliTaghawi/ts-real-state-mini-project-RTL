import connectDB from "@/utils/connectDB";
import RSFile from "@/models/RSFile";
import RSUser from "@/models/RSUser";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";
import FileDetailsPage from "@/templates/FileDetailsPage";
export const dynamicParams = true;

export async function generateStaticParams() {
  await connectDB();
  const files = await RSFile.aggregate([
    { $match: { published: true } },
    { $project: { _id: 1 } },
    { $limit: 2 }
  ]);
  return files.map((file: any) => ({ fileId: file._id.toString() }));
}

const FileDetails = async ({ params }: { params: Promise<{ fileId: string }> }) => {
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
    isOwner = user?._id.toString() === file.userId?.toString();
  }

  // Non-admins and non-subadmins can only view published files
  if (!isAdmin && !isSubAdmin && file.published !== true) {
    notFound();
  }

  // تبدیل Mongoose document به plain object برای Client Component
  const fileData = JSON.parse(JSON.stringify(file));

  return (
    <FileDetailsPage file={fileData} isAdmin={isAdmin} isSubAdmin={isSubAdmin} isOwner={isOwner} />
  )
};

export default FileDetails;
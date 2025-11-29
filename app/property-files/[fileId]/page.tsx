import connectDB from "@/utils/connectDB";
import RSFile, { FileType } from "@/models/RSFile";
import { notFound } from "next/navigation";
import FileDetailsPageWrapper from "@/templates/FileDetailsPageWrapper";
import type { Metadata } from "next";

export const revalidate = 14400; // 4 hours in seconds (4 * 60 * 60)
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
    const file = await RSFile.findOne({ _id: fileId }).populate("userId", "showName fullName _id").lean();
    if (!file) notFound();

    // تبدیل Mongoose document به plain object برای Client Component
    const fileData = JSON.parse(JSON.stringify(file));

    // Use wrapper component for client-side session check (allows ISR)
    return <FileDetailsPageWrapper file={fileData} />;
  } catch (error) {
    console.error("Error in FileDetails page:", error);
    throw error;
  }
};

export default FileDetails;
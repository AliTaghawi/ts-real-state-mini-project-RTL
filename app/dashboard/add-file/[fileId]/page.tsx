import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import EditFilePage from "@/templates/EditFilePage";
import type { Metadata } from "next";
// import connectDB from "@/utils/connectDB";
// import { getServerSession } from "next-auth";
// import RSFile from "@/models/RSFile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ویرایش آگهی - Real State",
  description: "ویرایش آگهی املاک در Real State",
};

const EditFile = async ({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) => {
  const { fileId } = await params;
  if (!isValidObjectId(fileId)) notFound();
  // if (!isValidObjectId(fileId)) return notFound()
  // await connectDB()
  // const file = await RSFile.findOne({_id: fileId})
  // if (!file) return notFound()
  // console.log(file)

  // به خاطر اینکه کل داشبورد کلاینت ساید هست این قسمت رو هم کلاینت ساید ایجاد میکنم

  return <EditFilePage id={fileId} />;
};

export default EditFile;

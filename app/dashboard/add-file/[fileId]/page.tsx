import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import EditFilePage from "@/templates/EditFilePage";
import type { Metadata } from "next";

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

  return <EditFilePage id={fileId} />;
};

export default EditFile;

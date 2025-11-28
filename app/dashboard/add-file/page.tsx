import AddFilePage from "@/templates/AddFilePage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ثبت آگهی جدید - Real State",
  description: "ثبت آگهی جدید املاک در Real State",
};

const AddFile = () => {
  return (
    <AddFilePage />
  );
};

export default AddFile;
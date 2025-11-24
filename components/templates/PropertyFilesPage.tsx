import FileCard from "@/modules/FileCard";
import PropertyFilesPageSidebar from "@/modules/PropertyFilesPageSidebar";

const PropertyFilesPage = ({ files }: { files: any[] }) => {
  // console.log(files)
  return (
    <div className="sm:flex sm:gap-8 items-start">
      <PropertyFilesPageSidebar />
      <main className="w-full sm:w-[calc(100%-200px-2rem)] grid grid-cols-1 min-[820px]:grid-cols-2 min-[1150px]:grid-cols-3 gap-4 mb-8">
        {files.length ? null : <h2 className="font-medium text-lg">هیچ آگهی‌ای یافت نشد</h2>}
        {files.map((item: any) => (
          <FileCard file={JSON.parse(JSON.stringify(item))} key={item._id} />
        ))}
      </main>
    </div>
  );
};

export default PropertyFilesPage;

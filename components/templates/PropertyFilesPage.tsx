import FileCard from "@/modules/FileCard";
import PropertyFilesPageSidebar from "@/modules/PropertyFilesPageSidebar";
import Pagination from "@/elements/propertyFilesPage/Pagination";
import SortSelect from "@/elements/propertyFilesPage/SortSelect";

const PropertyFilesPage = ({ 
  files, 
  currentPage, 
  totalPages, 
  queryParams 
}: { 
  files: any[];
  currentPage: number;
  totalPages: number;
  queryParams: string;
}) => {
  return (
    <div className="sm:flex sm:gap-8 items-start">
      <PropertyFilesPageSidebar />
      <div className="w-full sm:w-[calc(100%-200px-2rem)]">
        <SortSelect />
        <main className="grid grid-cols-1 min-[820px]:grid-cols-2 min-[1150px]:grid-cols-3 gap-4 mb-8">
          {files.length ? null : <h2 className="font-medium text-lg">هیچ آگهی‌ای یافت نشد</h2>}
          {files.map((item: any) => (
            <FileCard file={JSON.parse(JSON.stringify(item))} key={item._id} />
          ))}
        </main>
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            queryParams={queryParams}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyFilesPage;

import React from "react";
import FileSlider from "@/elements/homePage/FileSlider";
import CategoriesSection from "@/elements/homePage/CategoriesSection";
  
interface HomePageProps {
  newestFiles: any[];
  apartmentFiles: any[];
  storeFiles: any[];
  officeFiles: any[];
  villaLandFiles: any[];
}

const HomePage = ({
  newestFiles,
  apartmentFiles,
  storeFiles,
  officeFiles,
  villaLandFiles,
}: HomePageProps) => {
  return (
    <div className="py-8">
      <CategoriesSection />
      
      <FileSlider title="جدیدترین آگهی‌ها" files={JSON.parse(JSON.stringify(newestFiles))} />
      <FileSlider title="آپارتمان‌ها" files={JSON.parse(JSON.stringify(apartmentFiles))} />
      <FileSlider title="مغازه‌ها" files={JSON.parse(JSON.stringify(storeFiles))} />
      <FileSlider title="دفترها" files={JSON.parse(JSON.stringify(officeFiles))} />
      <FileSlider title="ویلاها و زمین‌ها" files={JSON.parse(JSON.stringify(villaLandFiles))} />
    </div>
  );
};

export default HomePage;
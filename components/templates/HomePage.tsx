import React from "react";
import FileSlider from "@/elements/homePage/FileSlider";
import CategoriesSection from "@/elements/homePage/CategoriesSection";
import FileTypeSection from "@/elements/homePage/FileTypeSection";
import HeroSection from "@/elements/homePage/HeroSection";
  
interface HomePageProps {
  newestFiles: any[];
  apartmentFiles: any[];
  storeFiles: any[];
  officeFiles: any[];
  villaLandFiles: any[];
  sliderSettings?: {
    newest: boolean;
    apartment: boolean;
    store: boolean;
    office: boolean;
    villaLand: boolean;
  };
}

const HomePage = ({
  newestFiles,
  apartmentFiles,
  storeFiles,
  officeFiles,
  villaLandFiles,
  sliderSettings = {
    newest: true,
    apartment: true,
    store: true,
    office: true,
    villaLand: true,
  },
}: HomePageProps) => {
  return (
    <div className="py-8">
      <HeroSection />
      <CategoriesSection />
      
      {sliderSettings.newest && newestFiles.length > 0 && (
        <>
          <FileSlider title="جدیدترین آگهی‌ها" files={JSON.parse(JSON.stringify(newestFiles))} />
          <FileTypeSection />
        </>
      )}
      {sliderSettings.apartment && apartmentFiles.length > 0 && (
        <FileSlider title="آپارتمان‌ها" files={JSON.parse(JSON.stringify(apartmentFiles))} />
      )}
      {sliderSettings.store && storeFiles.length > 0 && (
        <FileSlider title="مغازه‌ها" files={JSON.parse(JSON.stringify(storeFiles))} />
      )}
      {sliderSettings.office && officeFiles.length > 0 && (
        <FileSlider title="دفترها" files={JSON.parse(JSON.stringify(officeFiles))} />
      )}
      {sliderSettings.villaLand && villaLandFiles.length > 0 && (
        <FileSlider title="ویلاها و زمین‌ها" files={JSON.parse(JSON.stringify(villaLandFiles))} />
      )}
    </div>
  );
};

export default HomePage;
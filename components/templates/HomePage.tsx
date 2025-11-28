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
  sectionSettings?: {
    hero: boolean;
    categories: boolean;
    fileTypes: boolean;
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
  sectionSettings = {
    hero: true,
    categories: true,
    fileTypes: true,
  },
}: HomePageProps) => {
  return (
    <div className="py-8">
      {sectionSettings.hero && <HeroSection />}
      {sectionSettings.categories && <CategoriesSection />}
      
      {sliderSettings.newest && newestFiles.length > 0 && (
        <>
          <FileSlider 
            title="جدیدترین آگهی‌ها" 
            files={JSON.parse(JSON.stringify(newestFiles))} 
            viewAllLink="/property-files"
          />
          {sectionSettings.fileTypes && <FileTypeSection />}
        </>
      )}
      {sliderSettings.apartment && apartmentFiles.length > 0 && (
        <FileSlider 
          title="آپارتمان‌ها" 
          files={JSON.parse(JSON.stringify(apartmentFiles))} 
          viewAllLink="/property-files?category=apartment"
          categoryType="آپارتمان"
        />
      )}
      {sliderSettings.store && storeFiles.length > 0 && (
        <FileSlider 
          title="مغازه‌ها" 
          files={JSON.parse(JSON.stringify(storeFiles))} 
          viewAllLink="/property-files?category=store"
          categoryType="مغازه"
        />
      )}
      {sliderSettings.office && officeFiles.length > 0 && (
        <FileSlider 
          title="دفترها" 
          files={JSON.parse(JSON.stringify(officeFiles))} 
          viewAllLink="/property-files?category=office"
          categoryType="دفتر"
        />
      )}
      {sliderSettings.villaLand && villaLandFiles.length > 0 && (
        <FileSlider 
          title="ویلاها و زمین‌ها" 
          files={JSON.parse(JSON.stringify(villaLandFiles))} 
          viewAllLink="/property-files?category=villa"
          categoryType="ویلا و زمین"
        />
      )}
    </div>
  );
};

export default HomePage;
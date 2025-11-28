import HomePage from "@/templates/HomePage";
import RSUser from "@/models/RSUser";
import RSFile from "@/models/RSFile";
import Settings from "@/models/Settings";
import connectDB from "@/utils/connectDB";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "صفحه اصلی - Real State",
  description: "پلتفرم خرید، فروش و اجاره املاک. جستجو و مشاهده آگهی‌های املاک شامل آپارتمان، ویلا، مغازه، دفتر کار و زمین",
};

export default async function Home() {
  try {
    await connectDB();

    const newestFiles = await RSFile.find({ published: true })
      .populate("userId", "showName fullName _id")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const apartmentFiles = await RSFile.find({
      published: true,
      category: "apartment",
    })
      .populate("userId", "showName fullName _id")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const storeFiles = await RSFile.find({
      published: true,
      category: "store",
    })
      .populate("userId", "showName fullName _id")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const officeFiles = await RSFile.find({
      published: true,
      category: "office",
    })
      .populate("userId", "showName fullName _id")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const villaLandFiles = await RSFile.find({
      published: true,
      category: { $in: ["villa", "land"] },
    })
      .populate("userId", "showName fullName _id")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // دریافت تنظیمات
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const homePageSliders = settings.homePageSliders || {
      newest: true,
      apartment: true,
      store: true,
      office: true,
      villaLand: true,
    };
    const homePageSections = settings.homePageSections || {
      hero: true,
      categories: true,
      fileTypes: true,
    };

    return (
      <HomePage
        newestFiles={newestFiles}
        apartmentFiles={apartmentFiles}
        storeFiles={storeFiles}
        officeFiles={officeFiles}
        villaLandFiles={villaLandFiles}
        sliderSettings={homePageSliders}
        sectionSettings={homePageSections}
      />
    );
  } catch (error) {
    console.error("Error in Home page:", error);
    return <h2>مشکلی پیش آمده لطفاً مجدداً تلاش کنید.</h2>;
  }
}

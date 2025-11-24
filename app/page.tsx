import HomePage from "@/templates/HomePage";
import RSFile from "@/models/RSFile";
import connectDB from "@/utils/connectDB";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    await connectDB();

    const newestFiles = await RSFile.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const apartmentFiles = await RSFile.find({
      published: true,
      category: "apartment",
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const storeFiles = await RSFile.find({
      published: true,
      category: "store",
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const officeFiles = await RSFile.find({
      published: true,
      category: "office",
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const villaLandFiles = await RSFile.find({
      published: true,
      category: { $in: ["villa", "land"] },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return (
      <HomePage
        newestFiles={newestFiles}
        apartmentFiles={apartmentFiles}
        storeFiles={storeFiles}
        officeFiles={officeFiles}
        villaLandFiles={villaLandFiles}
      />
    );
  } catch (error) {
    console.error("Error in Home page:", error);
    return <h2>مشکلی پیش آمده لطفاً مجدداً تلاش کنید.</h2>;
  }
}

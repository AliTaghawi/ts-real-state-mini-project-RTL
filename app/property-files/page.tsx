import RSFile from "@/models/RSFile";
import PropertyFilesPage from "@/templates/PropertyFilesPage";
import { FiltersType } from "@/types/types";
import connectDB from "@/utils/connectDB";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<FiltersType>;
}

export default async function PropertyFiles({ searchParams }: Props) {
  try {
    await connectDB();
    const {
      fileType,
      category,
      areaMeterStart,
      areaMeterEnd,
      minPrice,
      maxPrice,
      minRent,
      maxRent,
      search: titleSearch,
    } = await searchParams;

    const filters: {
      published: boolean,
      fileType?: string,
      category?: string,
      areaMeter?: any,
      price?: any
      "price.rent"?: any,
      "price.mortgage"?: any
      title?: object
    } = { published: true };

    if (fileType) filters.fileType = fileType;
    if (category) filters.category = category;

    if (areaMeterStart || areaMeterEnd) {
      filters.areaMeter = {};
      if (areaMeterStart) filters.areaMeter.$gte = Number(areaMeterStart);
      if (areaMeterEnd) filters.areaMeter.$lte = Number(areaMeterEnd);
    }

    if (fileType === "buy" && (minPrice || maxPrice)) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    if (
      (fileType === "rent" || fileType === "mortgage") &&
      (minPrice || maxPrice)
    ) {
      filters["price.mortgage"] = {};
      if (minPrice) filters["price.mortgage"].$gte = Number(minPrice);
      if (maxPrice) filters["price.mortgage"].$lte = Number(maxPrice);
    }

    if (fileType === "rent" && (minRent || maxRent)) {
      filters["price.rent"] = {};
      if (minRent) filters["price.rent"].$gte = Number(minRent);
      if (maxRent) filters["price.rent"].$lte = Number(maxRent);
    }

    if (titleSearch) {
      filters.title = { $regex: titleSearch, $options: "i" };
    }

    const files = await RSFile.find(filters)
      .populate("userId", "showName fullName _id")
      .sort({ createdAt: -1 })
      .lean();

    // console.log(files);

    return <PropertyFilesPage files={files} />;
  } catch (error) {
    console.error("Error in PropertyFiles page:", error);
    return <h2>مشکلی پیش آمده لطفاً مجدداً تلاش کنید.</h2>;
  }
}

import RSFile from "@/models/RSFile";
import PropertyFilesPage from "@/templates/PropertyFilesPage";
import { FiltersType } from "@/types/types";
import connectDB from "@/utils/connectDB";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<FiltersType & { page?: string; sort?: string }>;
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
      page = "1",
      sort = "newest",
    } = await searchParams;

    const currentPage = Number(page) || 1;
    const itemsPerPage = 15;
    const skip = (currentPage - 1) * itemsPerPage;

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

    // تعداد کل آگهی‌ها
    const totalFiles = await RSFile.countDocuments(filters);
    const totalPages = Math.ceil(totalFiles / itemsPerPage);

    // تعیین مرتب‌سازی
    let sortOption: any = { createdAt: -1 }; // پیش‌فرض: جدیدترین
    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "price-high":
        // برای آگهی‌های فروش: price، برای اجاره: price.rent
        if (fileType === "buy") {
          sortOption = { price: -1 };
        } else if (fileType === "rent") {
          sortOption = { "price.rent": -1 };
        } else {
          sortOption = { price: -1 };
        }
        break;
      case "price-low":
        // برای آگهی‌های فروش: price، برای اجاره: price.rent
        if (fileType === "buy") {
          sortOption = { price: 1 };
        } else if (fileType === "rent") {
          sortOption = { "price.rent": 1 };
        } else {
          sortOption = { price: 1 };
        }
        break;
      case "area-high":
        sortOption = { areaMeter: -1 };
        break;
      case "area-low":
        sortOption = { areaMeter: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // دریافت آگهی‌های صفحه فعلی
    const files = await RSFile.find(filters)
      .populate("userId", "showName fullName _id")
      .sort(sortOption)
      .skip(skip)
      .limit(itemsPerPage)
      .lean();

    // ساخت query string برای لینک‌های صفحه‌بندی (بدون page)
    const queryParams = new URLSearchParams();
    if (fileType) queryParams.set("fileType", fileType);
    if (category) queryParams.set("category", category);
    if (areaMeterStart) queryParams.set("areaMeterStart", String(areaMeterStart));
    if (areaMeterEnd) queryParams.set("areaMeterEnd", String(areaMeterEnd));
    if (minPrice) queryParams.set("minPrice", String(minPrice));
    if (maxPrice) queryParams.set("maxPrice", String(maxPrice));
    if (minRent) queryParams.set("minRent", String(minRent));
    if (maxRent) queryParams.set("maxRent", String(maxRent));
    if (titleSearch) queryParams.set("search", String(titleSearch));
    if (sort && sort !== "newest") queryParams.set("sort", sort);

    return (
      <PropertyFilesPage 
        files={files} 
        currentPage={currentPage}
        totalPages={totalPages}
        queryParams={queryParams.toString()}
      />
    );
  } catch (error) {
    console.error("Error in PropertyFiles page:", error);
    return <h2>مشکلی پیش آمده لطفاً مجدداً تلاش کنید.</h2>;
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";
import { StatusCodes, StatusMessages } from "@/types/enums";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import RSFile from "@/models/RSFile";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const user = await RSUser.findOne({ email: session.user?.email });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: StatusMessages.FORBIDDEN },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    const { count = 35 } = await req.json();

    // دسته‌بندی‌ها و نوع‌های مختلف
    const categories = ["apartment", "store", "office", "villa", "land"];
    const fileTypes = ["rent", "mortgage", "buy"];
    const locations = [
      "تهران، منطقه 1",
      "تهران، منطقه 2",
      "تهران، منطقه 3",
      "تهران، منطقه 4",
      "تهران، منطقه 5",
      "اصفهان، خیابان چهارباغ",
      "مشهد، خیابان امام رضا",
      "شیراز، خیابان زند",
      "تبریز، خیابان فردوسی",
      "رشت، خیابان گلسار",
    ];

    const testFiles = [];

    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length];
      const fileType = fileTypes[i % fileTypes.length];
      const location = locations[i % locations.length];
      const isRent = fileType === "rent";

      const file = {
        title: `آگهی تستی ${i + 1} - ${category}`,
        description: `این یک آگهی تستی است برای تست صفحه‌بندی. آگهی شماره ${i + 1} در دسته‌بندی ${category} و نوع ${fileType}.`,
        location: location,
        address: `آدرس تستی ${i + 1}`,
        realState: "املاک تستی",
        phone: `0912${String(i).padStart(7, "0")}`,
        fileType: fileType,
        areaMeter: 50 + (i * 10),
        price: isRent
          ? {
              rent: 1000000 + (i * 100000),
              mortgage: 50000000 + (i * 5000000),
            }
          : 200000000 + (i * 10000000),
        category: category,
        constructionDate: new Date(2020 + (i % 5), i % 12, (i % 28) + 1),
        amenities: ["پارکینگ", "آسانسور", "انباری"],
        rules: ["سیگار ممنوع", "حیوان خانگی ممنوع"],
        images: [],
        userId: user._id,
        published: true,
      };

      testFiles.push(file);
    }

    await RSFile.insertMany(testFiles);

    return NextResponse.json(
      { message: `${count} آگهی تستی با موفقیت ایجاد شد` },
      { status: StatusCodes.CREATED }
    );
  } catch (error) {
    console.error("Create test files error:", error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


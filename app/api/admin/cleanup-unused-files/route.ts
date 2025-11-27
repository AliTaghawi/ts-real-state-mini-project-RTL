import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";
import { StatusCodes, StatusMessages } from "@/types/enums";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import RSFile from "@/models/RSFile";
import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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

    // دریافت همه تصاویر استفاده شده در آگهی‌ها
    const files = await RSFile.find({}, { images: 1 });
    const usedImages = new Set<string>();

    files.forEach((file) => {
      if (file.images && Array.isArray(file.images)) {
        file.images.forEach((imageUrl: string) => {
          if (imageUrl && imageUrl.startsWith("/uploads/")) {
            const filename = imageUrl.replace("/uploads/", "");
            usedImages.add(filename);
          }
        });
      }
    });

    // خواندن همه فایل‌های پوشه uploads
    const uploadsDir = join(process.cwd(), "public", "uploads");
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json(
        { message: "پوشه uploads وجود ندارد", deleted: 0 },
        { status: StatusCodes.OK }
      );
    }

    const allFiles = await readdir(uploadsDir);
    const imageFiles = allFiles.filter((file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    // پیدا کردن فایل‌های استفاده نشده
    const unusedFiles = imageFiles.filter((file) => !usedImages.has(file));

    // حذف فایل‌های استفاده نشده
    let deletedCount = 0;
    let totalSizeFreed = 0;
    const errors: string[] = [];

    for (const filename of unusedFiles) {
      try {
        const filepath = join(uploadsDir, filename);
        const stats = await stat(filepath);
        totalSizeFreed += stats.size;
        await unlink(filepath);
        deletedCount++;
      } catch (error: any) {
        errors.push(`خطا در حذف ${filename}: ${error.message}`);
      }
    }

    return NextResponse.json(
      {
        message: `پاکسازی انجام شد`,
        deleted: deletedCount,
        totalFiles: imageFiles.length,
        usedFiles: usedImages.size,
        freedSpaceMB: (totalSizeFreed / (1024 * 1024)).toFixed(2),
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


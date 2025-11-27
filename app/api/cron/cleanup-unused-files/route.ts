import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import RSFile from "@/models/RSFile";
import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// این endpoint برای cron job استفاده می‌شود
// باید با یک cron service (مثل Vercel Cron, cron-job.org, یا EasyCron) فراخوانی شود
export async function GET(req: NextRequest) {
  try {
    // بررسی cron secret برای امنیت
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

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
        { status: 200 }
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
        message: `پاکسازی خودکار انجام شد`,
        deleted: deletedCount,
        totalFiles: imageFiles.length,
        usedFiles: usedImages.size,
        freedSpaceMB: (totalSizeFreed / (1024 * 1024)).toFixed(2),
        timestamp: new Date().toISOString(),
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cron cleanup error:", error);
    return NextResponse.json(
      { error: "Server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}


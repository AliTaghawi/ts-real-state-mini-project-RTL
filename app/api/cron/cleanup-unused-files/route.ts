import { NextRequest, NextResponse } from "next/server";
import { list, del } from "@vercel/blob";
import connectDB from "@/utils/connectDB";
import RSFile from "@/models/RSFile";
import { logger } from "@/utils/logger";

// این endpoint برای cron job استفاده می‌شود
// در Vercel Cron به صورت خودکار با متد GET فراخوانی می‌شود
export async function GET(req: NextRequest) {
  try {
    // بررسی cron secret برای امنیت (اختیاری)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // دریافت همه تصاویر استفاده‌شده در آگهی‌ها
    const files = await RSFile.find({}, { images: 1 }).lean();
    const usedImageUrls = new Set<string>();

    files.forEach((file: any) => {
      if (file.images && Array.isArray(file.images)) {
        file.images.forEach((imageUrl: string) => {
          if (imageUrl) {
            usedImageUrls.add(imageUrl);
          }
        });
      }
    });

    // دریافت لیست همه Blobهایی که با prefix uploads/ ذخیره شده‌اند
    const blobsResult = await list({ prefix: "uploads/" });

    const unusedBlobs = blobsResult.blobs.filter((blob) => {
      // مقایسه براساس URL کامل
      return !usedImageUrls.has(blob.url);
    });

    let deletedCount = 0;
    const errors: string[] = [];

    for (const blob of unusedBlobs) {
      try {
        await del(blob.url);
        deletedCount++;
      } catch (error: any) {
        errors.push(`خطا در حذف ${blob.url}: ${error?.message || "Unknown error"}`);
      }
    }

    // ثبت لاگ موفقیت cron cleanup
    await logger.info({
      message: "Cron: Blob cleanup completed",
      context: {
        page: "cron/cleanup-unused-files",
        action: "blob_cleanup",
        additionalInfo: {
          deleted: deletedCount,
          totalBlobs: blobsResult.blobs.length,
          usedImages: usedImageUrls.size,
          errorsCount: errors.length,
        },
      },
    });

    return NextResponse.json(
      {
        message: "پاکسازی خودکار Blobهای استفاده‌نشده انجام شد",
        deleted: deletedCount,
        totalBlobs: blobsResult.blobs.length,
        usedImages: usedImageUrls.size,
        timestamp: new Date().toISOString(),
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // ثبت لاگ خطا
    await logger.error({
      message: "Cron: Blob cleanup failed",
      error,
      context: {
        page: "cron/cleanup-unused-files",
        action: "blob_cleanup",
      },
    });

    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


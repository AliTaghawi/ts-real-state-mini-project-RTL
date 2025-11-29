import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import { StatusCodes } from "@/types/enums";
import { logger } from "@/utils/logger";

export const dynamic = "force-dynamic";

// Cleanup expired unverified users
// This cron job should run every hour
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security (optional - Vercel Cron doesn't need it)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    await connectDB();

    const now = new Date();
    
    // Find all users with:
    // - emailVerified = false
    // - emailVerificationTokenExpiry < now (expired)
    const expiredUsers = await RSUser.find({
      emailVerified: false,
      emailVerificationTokenExpiry: { $lt: now },
    });

    if (expiredUsers.length === 0) {
      // لاگ اطلاعاتی در صورت نبود کاربر منقضی‌شده
      await logger.info({
        message: "Cron: No expired unverified users to cleanup",
        context: {
          page: "cron/cleanup-expired-users",
          action: "user_cleanup",
        },
      });

      return NextResponse.json(
        { message: "No expired unverified users found", deleted: 0 },
        { status: StatusCodes.OK }
      );
    }

    // Delete expired unverified users
    const result = await RSUser.deleteMany({
      emailVerified: false,
      emailVerificationTokenExpiry: { $lt: now },
    });

    // لاگ موفقیت‌آمیز بودن پاکسازی
    await logger.info({
      message: "Cron: Expired unverified users cleanup completed",
      context: {
        page: "cron/cleanup-expired-users",
        action: "user_cleanup",
        additionalInfo: {
          found: expiredUsers.length,
          deleted: result.deletedCount,
        },
      },
    });

    return NextResponse.json(
      {
        message: `Successfully deleted ${result.deletedCount} expired unverified users`,
        deleted: result.deletedCount,
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    // لاگ خطا
    await logger.error({
      message: "Cron: Expired unverified users cleanup failed",
      error,
      context: {
        page: "cron/cleanup-expired-users",
        action: "user_cleanup",
      },
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


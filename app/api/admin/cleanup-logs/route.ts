import { NextRequest, NextResponse } from "next/server";
import { StatusCodes, StatusMessages } from "@/types/enums";
import connectDB from "@/utils/connectDB";
import { logger } from "@/utils/logger";

// This endpoint is called by cron job
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret (optional - Vercel Cron doesn't need it)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    await connectDB();
    
    // Import Log model after connecting to DB
    const Log = (await import("@/models/Log")).default;

    // Delete logs older than 30 days by default
    const days = parseInt(process.env.LOG_RETENTION_DAYS || "30");
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Log.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    // Log success
    await logger.info({
      message: "Cron: Log cleanup completed",
      context: {
        page: "admin/cleanup-logs",
        action: "log_cleanup",
        additionalInfo: {
          deletedCount: result.deletedCount,
          retentionDays: days,
        },
      },
    });

    return NextResponse.json(
      {
        message: `Cleaned up ${result.deletedCount} log entries older than ${days} days`,
        deletedCount: result.deletedCount,
      },
      { status: StatusCodes.OK }
    );
  } catch (error: any) {
    // Log error
    await logger.error({
      message: "Cron: Log cleanup failed",
      error,
      context: {
        page: "admin/cleanup-logs",
        action: "log_cleanup",
      },
    });

    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


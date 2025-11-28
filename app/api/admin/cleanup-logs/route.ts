import { NextRequest, NextResponse } from "next/server";
import { StatusCodes, StatusMessages } from "@/types/enums";
import connectDB from "@/utils/connectDB";

// This endpoint is called by cron job
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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

    return NextResponse.json(
      {
        message: `Cleaned up ${result.deletedCount} log entries older than ${days} days`,
        deletedCount: result.deletedCount,
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Error in cleanup logs cron:", error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


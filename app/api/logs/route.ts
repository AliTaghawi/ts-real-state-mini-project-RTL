import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";
import { StatusCodes, StatusMessages } from "@/types/enums";
import connectDB from "@/utils/connectDB";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Import models after connecting to DB
    const Log = (await import("@/models/Log")).default;
    const RSUser = (await import("@/models/RSUser")).default;

    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate body exists
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const {
      level = "error",
      message,
      error,
      user,
      request,
      context,
    } = body;

    // Get IP and user agent from headers
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const referer = req.headers.get("referer") || undefined;

    // Try to get user from session if available
    let userId = undefined;
    let email = undefined;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const dbUser = await RSUser.findOne({ email: session.user.email });
        if (dbUser) {
          userId = dbUser._id.toString();
          email = dbUser.email;
        }
      }
    } catch (e) {
      // Ignore session errors
    }

    // Validate required fields
    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate level
    const validLevels = ["error", "warn", "info", "debug"];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: "Invalid log level" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const logData = {
      level,
      message: message.trim(),
      error: error || undefined,
      user: {
        ...(user || {}),
        userId: user?.userId || userId,
        email: user?.email || email,
        ip: user?.ip || ip,
        userAgent: user?.userAgent || userAgent,
      },
      request: {
        ...(request || {}),
        referer: request?.referer || referer,
      },
      context: context || undefined,
      timestamp: new Date(),
    };

    try {
      await Log.create(logData);
    } catch (dbError: any) {
      // Handle Mongoose validation errors
      const errorMessage = dbError?.errors 
        ? Object.values(dbError.errors).map((e: any) => e.message).join(", ")
        : dbError?.message || "Database error";
      
      console.error("Error creating log in database:", errorMessage);
      return NextResponse.json(
        { error: "Failed to record log", details: errorMessage },
        { status: StatusCodes.SERVER_ERROR }
      );
    }

    return NextResponse.json(
      { message: "Log recorded successfully" },
      { status: StatusCodes.CREATED }
    );
  } catch (error: any) {
    // Handle any other unexpected errors
    const errorMessage = error?.details?.[0]?.message || error?.message || "Unknown error";
    console.error("Error recording log:", errorMessage);
    return NextResponse.json(
      { error: "Failed to record log", details: errorMessage },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Import models after connecting to DB
    const Log = (await import("@/models/Log")).default;
    const RSUser = (await import("@/models/RSUser")).default;

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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const level = searchParams.get("level");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (level) {
      filter.level = level;
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }

    if (search) {
      filter.$or = [
        { message: { $regex: search, $options: "i" } },
        { "error.message": { $regex: search, $options: "i" } },
        { "request.path": { $regex: search, $options: "i" } },
        { "context.page": { $regex: search, $options: "i" } },
      ];
    }

    const logs = await Log.find(filter)
      .populate("user.userId", "showName fullName email")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Log.countDocuments(filter);

    return NextResponse.json(
      {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import { StatusCodes, StatusMessages } from "@/types/enums";
import { fileValidationSchema } from "@/utils/validation";
import RSFile from "@/models/RSFile";
import { authOptions } from "@/api/auth/config";
import { debugLogger } from "@/utils/debugLogger";

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      await debugLogger.logResponse("/api/files", "POST", StatusCodes.UNAUTHORIZED);
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const user = await RSUser.findOne({ email: session.user?.email });
    if (!user) {
      await debugLogger.logResponse("/api/files", "POST", StatusCodes.NOTFOUND, {
        email: session.user?.email ?? undefined,
      });
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    // Log request
    await debugLogger.logRequest(req as any, {
      endpoint: "/api/files",
      method: "POST",
      userId: user._id.toString(),
      email: user.email,
      additionalInfo: { action: "create_file" },
    });

    const body = await req.json();

    try {
      await fileValidationSchema.validateAsync(body);
    } catch (error: any) {
      const errorMessage = error?.details?.[0]?.message || error?.message || "خطا در اعتبارسنجی داده‌ها";
      console.log(error?.details?.[0] || error);
      return NextResponse.json(
        { error: errorMessage },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    // بررسی محدودیت حجم کل تصاویر (10MB)
    const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB
    const images = body.images || [];
    let totalSize = 0;

    for (const imageUrl of images) {
      if (imageUrl) {
        try {
          // Check if it's a Blob Storage URL or local upload
          if (imageUrl.startsWith("https://") || imageUrl.startsWith("http://")) {
            // Vercel Blob Storage URL - get size from HEAD request
            const response = await fetch(imageUrl, { method: "HEAD" });
            const contentLength = response.headers.get("content-length");
            if (contentLength) {
              totalSize += parseInt(contentLength, 10);
            }
          } else if (imageUrl.startsWith("/uploads/")) {
            // Local file (for backward compatibility or local development)
            // Skip size check for local files as they might not exist in production
            // In production with Blob Storage, all URLs should be https://
            console.warn(`Local file path detected: ${imageUrl}. This should be a Blob Storage URL in production.`);
          }
        } catch (error) {
          console.error(`Error checking file size for ${imageUrl}:`, error);
        }
      }
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: `مجموع حجم تصاویر نمی‌تواند بیشتر از 10 مگابایت باشد. حجم فعلی: ${(totalSize / (1024 * 1024)).toFixed(2)} مگابایت` },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const newFile = await RSFile.create({
      ...body,
      // user._id is ObjectId so no need for conversion,
      userId: user._id,
      images: images,
    });

    const responseTime = Date.now() - startTime;
    await debugLogger.logResponse("/api/files", "POST", StatusCodes.CREATED, {
      userId: user._id.toString(),
      email: user.email,
      responseTime,
      additionalInfo: { fileId: newFile._id.toString() },
    });

    return NextResponse.json(
      { message: StatusMessages.FILE_CREATED },
      { status: StatusCodes.CREATED }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await debugLogger.logResponse("/api/files", "POST", StatusCodes.SERVER_ERROR, {
      responseTime,
      additionalInfo: { error: error instanceof Error ? error.message : "Unknown error" },
    });
    console.log(error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}

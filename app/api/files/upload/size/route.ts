import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";
import { StatusCodes, StatusMessages } from "@/types/enums";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const { imageUrls } = await req.json();

    if (!Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: "لیست تصاویر معتبر نیست" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    let totalSize = 0;
    const sizes: { [url: string]: number } = {};

    for (const imageUrl of imageUrls) {
      if (imageUrl) {
        try {
          // Check if it's a Blob Storage URL
          if (imageUrl.startsWith("https://") || imageUrl.startsWith("http://")) {
            // Vercel Blob Storage URL - get size from HEAD request
            const response = await fetch(imageUrl, { method: "HEAD" });
            const contentLength = response.headers.get("content-length");
            if (contentLength) {
              const size = parseInt(contentLength, 10);
              sizes[imageUrl] = size;
              totalSize += size;
            }
          } else if (imageUrl.startsWith("/uploads/")) {
            // Local file (for backward compatibility or local development)
            console.warn(`Local file path detected: ${imageUrl}. This should be a Blob Storage URL in production.`);
          }
        } catch (error) {
          console.error(`Error getting size for ${imageUrl}:`, error);
        }
      }
    }

    return NextResponse.json(
      { totalSize, sizes },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Get file sizes error:", error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


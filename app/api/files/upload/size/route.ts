import { NextRequest, NextResponse } from "next/server";
import { statSync } from "fs";
import { join } from "path";
import { existsSync } from "fs";
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
      if (imageUrl && imageUrl.startsWith("/uploads/")) {
        try {
          const filename = imageUrl.replace("/uploads/", "");
          const filepath = join(process.cwd(), "public", "uploads", filename);
          
          if (existsSync(filepath)) {
            const stats = statSync(filepath);
            sizes[imageUrl] = stats.size;
            totalSize += stats.size;
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


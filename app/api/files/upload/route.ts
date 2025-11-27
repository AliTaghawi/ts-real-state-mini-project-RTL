import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "فایلی ارسال نشده است" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "نوع فایل معتبر نیست. فقط تصاویر مجاز است" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "حجم فایل نباید بیشتر از 5 مگابایت باشد" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL and file size
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json(
      { url: publicUrl, size: file.size },
      { status: StatusCodes.CREATED }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


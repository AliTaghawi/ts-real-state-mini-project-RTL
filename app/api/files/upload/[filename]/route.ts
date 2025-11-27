import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";
import { StatusCodes, StatusMessages } from "@/types/enums";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const { filename } = await params;
    
    // Security: فقط فایل‌های تصویر مجاز هستند
    if (!filename.match(/^[\w-]+\.(jpg|jpeg|png|webp)$/i)) {
      return NextResponse.json(
        { error: "نام فایل معتبر نیست" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const filepath = join(process.cwd(), "public", "uploads", filename);

    // بررسی وجود فایل
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: "فایل یافت نشد" },
        { status: StatusCodes.NOTFOUND }
      );
    }

    // حذف فایل
    await unlink(filepath);

    return NextResponse.json(
      { message: "فایل با موفقیت حذف شد" },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


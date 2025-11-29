import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
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

    // Get the full URL from request body or construct it
    // Since we're using Blob Storage, we need the full URL
    const body = await req.json().catch(() => ({}));
    const imageUrl = body.url || req.headers.get("x-image-url");

    if (!imageUrl || (!imageUrl.startsWith("https://") && !imageUrl.startsWith("http://"))) {
      return NextResponse.json(
        { error: "URL فایل معتبر نیست. باید URL کامل Blob Storage باشد" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // حذف فایل از Blob Storage
    await del(imageUrl);

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


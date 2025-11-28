import RSFile from "@/models/RSFile";
import RSUser from "@/models/RSUser";
import { StatusCodes, StatusMessages } from "@/types/enums";
import connectDB from "@/utils/connectDB";
import { fileValidationSchema } from "@/utils/validation";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/api/auth/config";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync, statSync } from "fs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }
    const user = await RSUser.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    const { fileId } = await params;
    if (!isValidObjectId(fileId)) {
      return NextResponse.json(
        { error: StatusMessages.INVALID_DATA },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    const file = await RSFile.findOne({ _id: fileId }).select(
      "-userId -createdAt -updatedAt"
    );
    if (!file) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_FILE },
        { status: StatusCodes.NOTFOUND }
      );
    }

    return NextResponse.json({ file }, { status: StatusCodes.OK });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }
    const user = await RSUser.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    const { fileId } = await params;
    if (!isValidObjectId(fileId)) {
      return NextResponse.json(
        { error: StatusMessages.INVALID_DATA },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    const file = await RSFile.findOne({ _id: fileId });
    if (!file) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_FILE },
        { status: StatusCodes.NOTFOUND }
      );
    }

    if (!user._id.equals(file.userId)) {
      return NextResponse.json(
        { error: StatusMessages.FORBIDDEN },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    const {
      title,
      description,
      location,
      phone,
      price,
      realState,
      constructionDate,
      category,
      areaMeter,
      fileType,
      address,
      rules,
      amenities,
      images,
    } = await req.json();

    try {
      await fileValidationSchema.validateAsync({
        title,
        description,
        location,
        phone,
        price,
        realState,
        constructionDate,
        category,
        areaMeter,
        fileType,
        address,
        rules,
        amenities,
      });
    } catch (error: any) {
      const errorMessage = error?.details?.[0]?.message || error?.message || "خطا در اعتبارسنجی داده‌ها";
      console.log(error?.details?.[0] || error);
      return NextResponse.json(
        { error: errorMessage },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    // حذف تصاویری که دیگر استفاده نمی‌شوند
    const oldImages = file.images || [];
    const newImages = Array.isArray(images) ? images : [];
    const imagesToDelete = oldImages.filter((img: string) => !newImages.includes(img));

    // بررسی محدودیت حجم کل تصاویر (10MB)
    const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB
    let totalSize = 0;

    for (const imageUrl of newImages) {
      if (imageUrl && imageUrl.startsWith("/uploads/")) {
        try {
          const filename = imageUrl.replace("/uploads/", "");
          const filepath = join(process.cwd(), "public", "uploads", filename);
          
          if (existsSync(filepath)) {
            const stats = statSync(filepath);
            totalSize += stats.size;
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

    // حذف فایل‌های فیزیکی
    for (const imageUrl of imagesToDelete) {
      if (imageUrl && imageUrl.startsWith("/uploads/")) {
        try {
          const filename = imageUrl.replace("/uploads/", "");
          const filepath = join(process.cwd(), "public", "uploads", filename);
          if (existsSync(filepath)) {
            await unlink(filepath);
          }
        } catch (error) {
          console.error(`Error deleting image ${imageUrl}:`, error);
        }
      }
    }

    file.title = title;
    file.description = description;
    file.location = location;
    file.phone = phone;
    file.price = price;
    file.realState = realState;
    file.constructionDate = constructionDate;
    file.category = category;
    file.areaMeter = areaMeter;
    file.fileType = fileType;
    file.address = address;
    file.rules = rules;
    file.amenities = amenities;
    file.images = newImages;
    await file.save();

    console.log("Updated file: ", file);

    return NextResponse.json(
      { message: StatusMessages.FILE_UPDATED },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }
    const user = await RSUser.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    const { fileId } = await params;
    if (!isValidObjectId(fileId)) {
      return NextResponse.json(
        { error: StatusMessages.INVALID_DATA },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    const file = await RSFile.findOne({ _id: fileId });
    if (!file) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_FILE },
        { status: StatusCodes.NOTFOUND }
      );
    }
    if (!user._id.equals(file.userId) || user.role !== "ADMIN") {
      return NextResponse.json(
        { message: StatusMessages.FORBIDDEN },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    // حذف تصاویر آگهی قبل از حذف آگهی
    if (file.images && Array.isArray(file.images)) {
      for (const imageUrl of file.images) {
        if (imageUrl && imageUrl.startsWith("/uploads/")) {
          try {
            const filename = imageUrl.replace("/uploads/", "");
            const filepath = join(process.cwd(), "public", "uploads", filename);
            if (existsSync(filepath)) {
              await unlink(filepath);
            }
          } catch (error) {
            console.error(`Error deleting image ${imageUrl}:`, error);
          }
        }
      }
    }

    const result = await RSFile.findOneAndDelete({ _id: fileId });
    console.log("DELETED file: ", result);

    return NextResponse.json(
      { message: StatusMessages.FILE_DELETED },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}

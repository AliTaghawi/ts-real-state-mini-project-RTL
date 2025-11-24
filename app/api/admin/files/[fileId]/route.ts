import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import RSFile from "@/models/RSFile";
import { StatusCodes, StatusMessages } from "@/types/enums";
import { authOptions } from "@/api/auth/config";
import { isValidObjectId } from "mongoose";

// Update file publish status (publish/unpublish/deny)
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

    const user = await RSUser.findOne({ email: session.user?.email });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: StatusMessages.FORBIDDEN },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    const { fileId } = await params;
    if (!isValidObjectId(fileId)) {
      return NextResponse.json(
        { error: StatusMessages.INVALID_DATA },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    const file = await RSFile.findById(fileId);
    if (!file) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_FILE },
        { status: StatusCodes.NOTFOUND }
      );
    }

    const { published } = await req.json();

    if (published !== true && published !== false && published !== null) {
      return NextResponse.json(
        { error: "Invalid published value. Must be true, false, or null" },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    file.published = published === null ? undefined : published;
    await file.save();

    return NextResponse.json(
      {
        message:
          published === true
            ? "آگهی با موفقیت منتشر شد"
            : published === false
            ? "آگهی رد شد"
            : "وضعیت انتشار آگهی حذف شد",
        file,
      },
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


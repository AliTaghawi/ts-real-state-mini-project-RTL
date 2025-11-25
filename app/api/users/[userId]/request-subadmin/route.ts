import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import { StatusCodes, StatusMessages } from "@/types/enums";
import { authOptions } from "@/api/auth/config";
import { isValidObjectId } from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
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

    const currentUser = await RSUser.findOne({ email: session.user?.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    const { userId } = await params;
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: StatusMessages.INVALID_DATA },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    // User can only request for themselves
    if (currentUser._id.toString() !== userId) {
      return NextResponse.json(
        { error: StatusMessages.FORBIDDEN },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    const user = await RSUser.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    if (user.role !== "USER") {
      return NextResponse.json(
        { error: "فقط کاربران عادی می‌توانند درخواست دهند" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (user.subadminRequest) {
      return NextResponse.json(
        { error: "درخواست شما قبلاً ارسال شده است" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    user.subadminRequest = true;
    await user.save();

    return NextResponse.json(
      { message: "درخواست شما با موفقیت ارسال شد" },
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


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import { StatusCodes, StatusMessages } from "@/types/enums";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "توکن یافت نشد" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Find user by token
    const user = await RSUser.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      return NextResponse.json(
        { error: "لینک نامعتبر است" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "ایمیل شما قبلاً تایید شده است و نمی‌توان آن را لغو کرد" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Delete the unverified user
    await RSUser.findByIdAndDelete(user._id);

    return NextResponse.json(
      { message: "ثبت نام لغو شد و ایمیل آزاد شد" },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Error rejecting email:", error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


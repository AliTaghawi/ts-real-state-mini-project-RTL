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
        { error: "توکن تایید یافت نشد" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // First find user by token
    const user = await RSUser.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      return NextResponse.json(
        { error: "لینک تایید نامعتبر است" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Check if token is expired
    if (user.emailVerificationTokenExpiry && user.emailVerificationTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "لینک تایید منقضی شده است. لطفا دوباره ثبت نام کنید" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "ایمیل شما قبلاً تایید شده است" },
        { status: StatusCodes.OK }
      );
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "ایمیل شما با موفقیت تایید شد" },
      { status: StatusCodes.OK }
    );
  } catch (error: any) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { error: error?.message || StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


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

    const user = await RSUser.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "لینک تایید نامعتبر یا منقضی شده است" },
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
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


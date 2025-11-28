import RSUser from "@/models/RSUser";
import { StatusCodes, StatusMessages } from "@/types/enums";
import { hashPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import { registerSchema } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { generateEmailToken, sendVerificationEmail } from "@/utils/email";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, confirmPassword } = await req.json();

    try {
      await registerSchema.validateAsync({ email, password, confirmPassword });
    } catch (error: any) {
      const errorMessage = error?.details?.[0]?.message || error?.message || "خطا در اعتبارسنجی داده‌ها";
      console.log(error?.details?.[0] || error);
      return NextResponse.json(
        { error: errorMessage },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    const existedUser = await RSUser.findOne({ email });
    if (existedUser) {
      return NextResponse.json(
        { error: StatusMessages.EXISTED_USER },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const showName: string = email.split("@")[0];
    const hashedPassword = await hashPassword(password);
    const emailToken = generateEmailToken();
    const emailTokenExpiry = new Date();
    emailTokenExpiry.setHours(emailTokenExpiry.getHours() + 24); // 24 hours expiry

    const user = await RSUser.create({
      email,
      password: hashedPassword,
      showName,
      emailVerificationToken: emailToken,
      emailVerificationTokenExpiry: emailTokenExpiry,
      emailVerified: false,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, emailToken);
    } catch (error) {
      console.error("Error sending verification email:", error);
      // Continue even if email fails - user can request resend
    }

    console.log("created user: ", user);

    return NextResponse.json(
      {
        message:
          "ثبت نام با موفقیت انجام شد. لطفا ایمیل خود را برای تکمیل ثبت نام بررسی کنید.",
      },
      { status: StatusCodes.CREATED }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}

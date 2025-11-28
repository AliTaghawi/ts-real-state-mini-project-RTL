import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import RSUser from "@/models/RSUser";
import connectDB from "@/utils/connectDB";
import { hashPassword, verifyPassword } from "@/utils/auth";
import { passwordUpdateSchema } from "@/utils/validation";
import { StatusCodes, StatusMessages } from "@/types/enums";
import { authOptions } from "@/api/auth/config";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const user = await RSUser.findOne({ email: session?.user?.email }).select(
      "+password"
    );
    if (!user) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    const { password, newPassword, confirmPassword } = await req.json();

    try {
      await passwordUpdateSchema.validateAsync({
        password,
        newPassword,
        confirmPassword,
      });
    } catch (error: any) {
      const errorMessage = error?.details?.[0]?.message || error?.message || "خطا در اعتبارسنجی داده‌ها";
      console.log(error?.details?.[0] || error);
      return NextResponse.json(
        { error: errorMessage },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: StatusMessages.WRONG_PASSWORD },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: StatusMessages.PASSWORD_UPDATED },
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

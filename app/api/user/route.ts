import { NextRequest, NextResponse } from "next/server";
import { StatusCodes, StatusMessages } from "@/types/enums";
import connectDB from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import RSUser from "@/models/RSUser";
import { verifyPassword } from "@/utils/auth";
import { userSchema } from "@/utils/validation";
import { authOptions } from "@/api/auth/config";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    // const user = await RSUser.findOne({ email: session?.user?.email });

    const [user] = await RSUser.aggregate([
      { $match: { email: session.user?.email } },
      {
        $project: {
          password: 0,
        },
      },
      {
        $lookup: {
          from: "rsfiles",
          foreignField: "userId",
          localField: "_id",
          as: "files",
        },
      },
    ]);
    if (!user) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    return NextResponse.json({ user }, { status: StatusCodes.OK });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}

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

    const user = await RSUser.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    const { fullName, showName, phone, bio, showSocials } = await req.json();

    try {
      await userSchema.validateAsync({
        fullName,
        showName,
        phone,
        bio,
        showSocials,
      });
    } catch (error: any) {
      const errorMessage = error?.details?.[0]?.message || error?.message || "خطا در اعتبارسنجی داده‌ها";
      console.log(error?.details?.[0] || error);
      return NextResponse.json(
        { error: errorMessage },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    // const isValid = await verifyPassword(password, user.password);
    // if (!isValid) {
    //   return NextResponse.json(
    //     { error: StatusMessages.WRONG_PASSWORD },
    //     { status: StatusCodes.UNPROCESSABLE_ENTITY }
    //   );
    // }

    // fullName ? (user.fullName = fullName) : null;
    // showName ? (user.showName = showName) : null;
    // phone ? (user.phone = phone) : null;
    // bio ? (user.bio = bio) : null;
    user.fullName = fullName;
    user.showName = showName;
    user.phone = phone;
    user.bio = bio;
    user.showSocials.email = showSocials.email;
    user.showSocials.phone = showSocials.phone;
    await user.save();

    return NextResponse.json(
      { message: StatusMessages.USER_UPDATED },
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

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: StatusMessages.UNAUTHORIZED },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const user = await RSUser.findOne({ email: session.user?.email }).select(
      "+password"
    );
    if (!user) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    const { password } = await req.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: StatusMessages.INVALID_DATA },
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

    await RSUser.findOneAndDelete({ email: user.email });

    return NextResponse.json(
      { message: StatusMessages.USER_DELETED },
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

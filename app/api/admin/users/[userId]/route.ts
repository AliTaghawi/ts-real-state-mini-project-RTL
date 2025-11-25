import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import { StatusCodes, StatusMessages } from "@/types/enums";
import { authOptions } from "@/api/auth/config";
import { isValidObjectId } from "mongoose";

// Ban/Unban user or update user role
export async function PATCH(
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

    const adminUser = await RSUser.findOne({ email: session.user?.email });
    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: StatusMessages.FORBIDDEN },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    const { userId } = await params;
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: StatusMessages.INVALID_DATA },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    const user = await RSUser.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    // Prevent admin from banning themselves
    if (user._id.equals(adminUser._id)) {
      return NextResponse.json(
        { error: "نمی‌توانید خود را مسدود کنید" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const { banned, role, subadminRequest } = await req.json();

    if (banned !== undefined) {
      user.banned = banned;
    }

    if (subadminRequest !== undefined) {
      if (subadminRequest === false) {
        // Reject subadmin request
        user.subadminRequest = false;
      } else if (subadminRequest === true && user.subadminRequest) {
        // Approve subadmin request
        user.role = "SUBADMIN";
        user.subadminRequest = false;
      }
    }

    if (role !== undefined) {
      if (!["USER", "SUBADMIN"].includes(role)) {
        return NextResponse.json(
          { error: "نقش نامعتبر است" },
          { status: StatusCodes.UNPROCESSABLE_ENTITY }
        );
      }
      // Prevent changing own role
      if (user._id.equals(adminUser._id)) {
        return NextResponse.json(
          { error: "نمی‌توانید نقش خود را تغییر دهید" },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      user.role = role;
    }

    await user.save();

    return NextResponse.json(
      {
        message: banned !== undefined
          ? banned
            ? "کاربر با موفقیت مسدود شد"
            : "کاربر با موفقیت از حالت مسدود خارج شد"
          : "نقش کاربر با موفقیت تغییر یافت",
        user,
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


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import RSFile from "@/models/RSFile";
import { StatusCodes, StatusMessages } from "@/types/enums";
import { authOptions } from "@/api/auth/config";

export const dynamic = "force-dynamic";

// Get notifications for admin
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

    const user = await RSUser.findOne({ email: session.user?.email });
    if (!user || (user.role !== "ADMIN" && user.role !== "SUBADMIN")) {
      return NextResponse.json(
        { error: StatusMessages.FORBIDDEN },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    // Get pending files (not published) - last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const pendingFiles = await RSFile.find({
      $or: [
        { published: { $exists: false } },
        { published: null },
      ],
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate("userId", "showName fullName email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get new users (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    const newUsers = await RSUser.find({
      createdAt: { $gte: oneDayAgo },
      role: "USER",
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get subadmin requests
    const subadminRequests = await RSUser.find({
      subadminRequest: true,
      role: "USER",
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const notifications = [
      ...pendingFiles.map((file: any) => ({
        type: "file_pending",
        id: file._id.toString(),
        title: `آگهی جدید: ${file.title}`,
        message: `آگهی جدیدی توسط ${file.userId?.showName || file.userId?.email || "کاربر"} ثبت شده است`,
        link: `/property-files/${file._id}`,
        createdAt: file.createdAt,
      })),
      ...newUsers.map((user: any) => ({
        type: "user_registered",
        id: user._id.toString(),
        title: `کاربر جدید: ${user.showName || user.email}`,
        message: `کاربر جدیدی ثبت نام کرده است`,
        link: `/users/${user._id}`,
        createdAt: user.createdAt,
      })),
      ...subadminRequests.map((user: any) => ({
        type: "subadmin_request",
        id: user._id.toString(),
        title: `درخواست SUBADMIN: ${user.showName || user.email}`,
        message: `${user.showName || user.email} درخواست مدیر فرعی شدن داده است`,
        link: `/Admin?tab=users#user-${user._id}`,
        createdAt: user.updatedAt || user.createdAt,
      })),
    ].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({ notifications }, { status: StatusCodes.OK });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


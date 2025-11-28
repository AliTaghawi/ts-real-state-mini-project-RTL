import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";
import { StatusCodes, StatusMessages } from "@/types/enums";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import Settings from "@/models/Settings";

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
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: StatusMessages.FORBIDDEN },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    // دریافت تنظیمات یا ایجاد تنظیمات پیش‌فرض
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json(
      { settings },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Get settings error:", error);
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

    const user = await RSUser.findOne({ email: session.user?.email });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: StatusMessages.FORBIDDEN },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    const { homePageSliders } = await req.json();

    if (!homePageSliders || typeof homePageSliders !== "object") {
      return NextResponse.json(
        { error: "داده‌های نامعتبر" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // دریافت یا ایجاد تنظیمات
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    // به‌روزرسانی تنظیمات
    settings.homePageSliders = {
      newest: homePageSliders.newest ?? settings.homePageSliders.newest,
      apartment: homePageSliders.apartment ?? settings.homePageSliders.apartment,
      store: homePageSliders.store ?? settings.homePageSliders.store,
      office: homePageSliders.office ?? settings.homePageSliders.office,
      villaLand: homePageSliders.villaLand ?? settings.homePageSliders.villaLand,
    };

    await settings.save();

    return NextResponse.json(
      { message: "تنظیمات با موفقیت به‌روزرسانی شد", settings },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: StatusMessages.SERVER_ERROR },
      { status: StatusCodes.SERVER_ERROR }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { StatusCodes, StatusMessages } from "@/types/enums";
import connectDB from "@/utils/connectDB";
import Settings from "@/models/Settings";
import { checkAdminAccess } from "@/utils/checkAdminAccess";
import { securityLogger } from "@/utils/securityLogger";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const adminCheck = await checkAdminAccess(req);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error === "Unauthorized" ? StatusMessages.UNAUTHORIZED : StatusMessages.FORBIDDEN },
        { status: adminCheck.error === "Unauthorized" ? StatusCodes.UNAUTHORIZED : StatusCodes.FORBIDDEN }
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

    const adminCheck = await checkAdminAccess(req);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error === "Unauthorized" ? StatusMessages.UNAUTHORIZED : StatusMessages.FORBIDDEN },
        { status: adminCheck.error === "Unauthorized" ? StatusCodes.UNAUTHORIZED : StatusCodes.FORBIDDEN }
      );
    }

    // Log admin action
    try {
      const body = await req.clone().json();
      const tab = req.nextUrl.searchParams.get("tab") || "unknown";
      await securityLogger.logAdminAction(
        "update_settings",
        adminCheck.user?._id,
        adminCheck.user?.email,
        { settings: Object.keys(body), tab }
      );
    } catch (e) {
      // Ignore logging errors
    }

    const { homePageSliders, homePageSections } = await req.json();

    // دریافت یا ایجاد تنظیمات
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    // به‌روزرسانی تنظیمات اسلایدرها
    if (homePageSliders && typeof homePageSliders === "object") {
      settings.homePageSliders = {
        newest: homePageSliders.newest ?? settings.homePageSliders.newest,
        apartment: homePageSliders.apartment ?? settings.homePageSliders.apartment,
        store: homePageSliders.store ?? settings.homePageSliders.store,
        office: homePageSliders.office ?? settings.homePageSliders.office,
        villaLand: homePageSliders.villaLand ?? settings.homePageSliders.villaLand,
      };
    }

    // به‌روزرسانی تنظیمات بخش‌ها
    if (homePageSections && typeof homePageSections === "object") {
      settings.homePageSections = {
        hero: homePageSections.hero ?? settings.homePageSections.hero,
        categories: homePageSections.categories ?? settings.homePageSections.categories,
        fileTypes: homePageSections.fileTypes ?? settings.homePageSections.fileTypes,
      };
    }

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


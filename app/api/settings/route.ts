import { NextResponse } from "next/server";
import { StatusCodes, StatusMessages } from "@/types/enums";
import connectDB from "@/utils/connectDB";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectDB();

    // دریافت تنظیمات یا ایجاد تنظیمات پیش‌فرض
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json(
      { 
        homePageSliders: settings.homePageSliders,
        homePageSections: settings.homePageSections,
      },
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


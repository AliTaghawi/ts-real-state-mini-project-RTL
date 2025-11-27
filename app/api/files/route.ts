import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/utils/connectDB";
import RSUser from "@/models/RSUser";
import { StatusCodes, StatusMessages } from "@/types/enums";
import { fileValidationSchema } from "@/utils/validation";
import RSFile from "@/models/RSFile";
import { authOptions } from "@/api/auth/config";

export async function POST(req: Request) {
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
    if (!user) {
      return NextResponse.json(
        { error: StatusMessages.NOTFOUND_USER },
        { status: StatusCodes.NOTFOUND }
      );
    }

    const body = await req.json();

    try {
      await fileValidationSchema.validateAsync(body);
    } catch (error: any) {
      console.log(error.details[0]);
      return NextResponse.json(
        { error: error.details[0].message },
        { status: StatusCodes.UNPROCESSABLE_ENTITY }
      );
    }

    const newFile = await RSFile.create({
      ...body,
      // user._id is ObjectId so no need for conversion,
      userId: user._id,
      images: body.images || [],
    });

    return NextResponse.json(
      { message: StatusMessages.FILE_CREATED },
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

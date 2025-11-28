import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/config";
import connectDB from "./connectDB";
import { securityLogger } from "./securityLogger";
import { NextRequest } from "next/server";

interface AdminCheckResult {
  isAdmin: boolean;
  user?: {
    _id: string;
    email: string;
    role: string;
  };
  error?: string;
}

export async function checkAdminAccess(
  req?: NextRequest
): Promise<AdminCheckResult> {
  try {
    await connectDB();
    const RSUser = (await import("@/models/RSUser")).default;

    const session = await getServerSession(authOptions);
    if (!session) {
      // Log unauthorized access attempt
      try {
        await securityLogger.logUnauthorizedAccess(
          req?.nextUrl?.pathname || "unknown",
          undefined,
          undefined,
          "ADMIN"
        );
      } catch (e) {
        // Ignore logging errors
      }
      return {
        isAdmin: false,
        error: "Unauthorized",
      };
    }

    const user = await RSUser.findOne({ email: session.user?.email });
    if (!user) {
      return {
        isAdmin: false,
        error: "User not found",
      };
    }

    if (user.role !== "ADMIN") {
      // Log unauthorized access attempt
      try {
        await securityLogger.logUnauthorizedAccess(
          req?.nextUrl?.pathname || "unknown",
          user._id.toString(),
          user.email,
          "ADMIN"
        );
      } catch (e) {
        // Ignore logging errors
      }
      return {
        isAdmin: false,
        user: {
          _id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        error: "Forbidden - Admin access required",
      };
    }

    return {
      isAdmin: true,
      user: {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Error checking admin access:", error);
    return {
      isAdmin: false,
      error: "Server error",
    };
  }
}


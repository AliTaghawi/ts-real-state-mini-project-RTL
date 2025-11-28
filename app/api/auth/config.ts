import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import connectDB from "@/utils/connectDB";
import { loginSchema } from "@/utils/validation";
import { verifyPassword } from "@/utils/auth";
import RSUser from "@/models/RSUser";
import { StatusMessages } from "@/types/enums";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "text" },
      },
      async authorize(credentials) {
        const { email, password = "" } = credentials ?? {};

        try {
          await connectDB();
        } catch (error) {
          console.log(error);
          throw new Error(StatusMessages.SERVER_ERROR);
        }

        try {
          await loginSchema.validateAsync({ email, password });
        } catch (error: any) {
          const errorMessage = error?.details?.[0]?.message || error?.message || "خطا در اعتبارسنجی داده‌ها";
          console.log(error?.details?.[0] || error);
          throw new Error(errorMessage);
        }

        // After validation, email is guaranteed to be a string
        // But TypeScript doesn't narrow types in async functions, so we need assertion
        if (!email) {
          throw new Error(StatusMessages.INVALID_DATA);
        }

        // Type assertion: after validation and check, email is definitely a string
        const userEmail = email!;
        const user = await RSUser.findOne({ email: userEmail }).select("+password");
        if (!user) {
          // Log failed login attempt - user not found
          try {
            const { securityLogger } = await import("@/utils/securityLogger");
            await securityLogger.logLoginAttempt(userEmail, false, "User not found");
          } catch (e) {
            // Ignore logging errors
          }
          throw new Error(StatusMessages.NOTFOUND_USER);
        }

        if (user.banned) {
          // Log banned user login attempt
          try {
            const { securityLogger } = await import("@/utils/securityLogger");
            await securityLogger.logLoginAttempt(userEmail, false, "Account banned", user._id.toString());
          } catch (e) {
            // Ignore logging errors
          }
          throw new Error("حساب کاربری شما مسدود شده است");
        }

        if (!user.emailVerified) {
          // Log unverified email login attempt
          try {
            const { securityLogger } = await import("@/utils/securityLogger");
            await securityLogger.logLoginAttempt(userEmail, false, "Email not verified", user._id.toString());
          } catch (e) {
            // Ignore logging errors
          }
          throw new Error("لطفا ابتدا ایمیل خود را تایید کنید");
        }

        const isValid: boolean = await verifyPassword(password, user.password);
        if (!isValid) {
          // Log failed login attempt
          try {
            const { securityLogger } = await import("@/utils/securityLogger");
            await securityLogger.logLoginAttempt(userEmail, false, "Wrong password");
          } catch (e) {
            // Ignore logging errors
          }
          throw new Error(StatusMessages.WRONG_EMAIL_PASSWORD);
        }

        // Log successful login (especially for admins)
        try {
          const { securityLogger } = await import("@/utils/securityLogger");
          await securityLogger.logLoginAttempt(
            userEmail,
            true,
            undefined,
            user._id.toString()
          );
          if (user.role === "ADMIN") {
            await securityLogger.logAdminAction("admin_login", user._id.toString(), userEmail);
          }
        } catch (e) {
          // Ignore logging errors
        }

        return { email: userEmail, id: user._id };
      },
    }),
  ],
};


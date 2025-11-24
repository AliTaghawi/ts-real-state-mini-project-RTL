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
          console.log(error.details[0]);
          throw new Error(error.details[0].message);
        }

        const user = await RSUser.findOne({ email }).select("+password");
        if (!user) throw new Error(StatusMessages.NOTFOUND_USER);

        if (user.banned) {
          throw new Error("حساب کاربری شما مسدود شده است");
        }

        const isValid: boolean = await verifyPassword(password, user.password);
        if (!isValid) throw new Error(StatusMessages.WRONG_EMAIL_PASSWORD);

        return { email, id: user._id };
      },
    }),
  ],
};


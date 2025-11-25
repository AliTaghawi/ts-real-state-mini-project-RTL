import { Schema, model, models, InferSchemaType } from "mongoose";

const rsUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    fullName: String,
    showName: String,
    phone: String,
    bio: String,
    showSocials: {
      email: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: Boolean,
        default: false,
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["USER", "SUBADMIN", "ADMIN"],
      default: "USER",
    },
    banned: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
    subadminRequest: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const RSUser = models.RSUser || model("RSUser", rsUserSchema);

export default RSUser;
export type UserType =  InferSchemaType<typeof rsUserSchema>
export type SafeUser = Omit<UserType, "password">
export type FrontUser = Omit<UserType, "email" | "password" | "role" | "createdAt" | "updatedAt">

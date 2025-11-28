import { Schema, model, models } from "mongoose";

interface LogTypes {
  _id: Schema.Types.ObjectId;
  level: "error" | "warn" | "info" | "debug";
  message: string;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
  user?: {
    userId?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
  };
  request?: {
    method?: string;
    url?: string;
    path?: string;
    query?: object;
    body?: object;
    referer?: string;
  };
  context?: {
    page?: string;
    action?: string;
    component?: string;
    additionalInfo?: object;
  };
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const logSchema = new Schema<LogTypes>(
  {
    level: {
      type: String,
      enum: ["error", "warn", "info", "debug"],
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    error: {
      name: String,
      message: String,
      stack: String,
    },
    user: {
      userId: { type: Schema.Types.ObjectId, ref: "RSUser" },
      email: String,
      ip: String,
      userAgent: String,
    },
    request: {
      method: String,
      url: String,
      path: String,
      query: Schema.Types.Mixed,
      body: Schema.Types.Mixed,
      referer: String,
    },
    context: {
      page: String,
      action: String,
      component: String,
      additionalInfo: Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
logSchema.index({ timestamp: -1 });
logSchema.index({ level: 1, timestamp: -1 });
logSchema.index({ "user.userId": 1 });

const Log = models.Log || model("Log", logSchema);

export default Log;


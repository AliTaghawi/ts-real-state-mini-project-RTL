import connectDB from "./connectDB";

interface LogData {
  level?: "error" | "warn" | "info" | "debug";
  message: string;
  error?: Error | { name?: string; message?: string; stack?: string };
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
}

export const logger = {
  async log(data: LogData) {
    try {
      // Validate data
      if (!data || !data.message) {
        console.error("Invalid log data: missing message", data);
        return;
      }

      await connectDB();
      
      // Dynamic import to ensure DB is connected first
      const { default: Log } = await import("@/models/Log");

      const {
        level = "error",
        message,
        error,
        user,
        request,
        context,
      } = data;

      const errorData = error
        ? {
            name: error instanceof Error ? error.name : error.name,
            message: error instanceof Error ? error.message : error.message,
            stack: error instanceof Error ? error.stack : error.stack,
          }
        : undefined;

      await Log.create({
        level,
        message: message || "Unknown log message",
        error: errorData,
        user,
        request,
        context,
        timestamp: new Date(),
      });
    } catch (err: any) {
      // Fallback to console if database logging fails
      // Don't log the error details if it's a validation error to avoid recursion
      const errorMessage = err?.message || "Unknown error";
      const errorDetails = err?.errors 
        ? Object.values(err.errors).map((e: any) => e.message).join(", ")
        : errorMessage;
      
      console.error("Failed to log to database:", errorDetails);
      
      // Only log minimal data to avoid recursion
      if (data && typeof data === "object" && data.message && typeof data.message === "string") {
        console.error("Original log data:", { 
          message: data.message.substring(0, 100), // Limit message length
          level: data.level 
        });
      } else {
        console.error("Original log data was invalid or missing message");
      }
    }
  },

  async error(data: LogData) {
    await this.log({ ...data, level: "error" });
  },

  async warn(data: LogData) {
    await this.log({ ...data, level: "warn" });
  },

  async info(data: LogData) {
    await this.log({ ...data, level: "info" });
  },

  async debug(data: LogData) {
    await this.log({ ...data, level: "debug" });
  },
};


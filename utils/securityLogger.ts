import { logger } from "./logger";

interface SecurityLogData {
  action: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  reason?: string;
  success?: boolean;
}

// Check if we're in a client environment
const isClient = typeof window !== "undefined";

// Helper function to log via API (for client components) or directly (for server components)
const logViaAPI = async (logData: {
  level: "error" | "warn" | "info" | "debug";
  message: string;
  error?: { name?: string; message?: string; stack?: string };
  user?: { userId?: string; email?: string; ip?: string; userAgent?: string };
  request?: { method?: string; url?: string; path?: string; query?: object; body?: object; referer?: string };
  context?: { page?: string; action?: string; component?: string; additionalInfo?: object };
}) => {
  if (isClient) {
    // Use API route for client components
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      });
    } catch (err) {
      // Silently fail in client - don't log to console to avoid recursion
      // Just ignore the error to prevent infinite loops
    }
  } else {
    // Use direct logger for server components
    try {
      await logger[logData.level](logData);
    } catch (err) {
      // Silently fail in server too to avoid recursion
    }
  }
};

export const securityLogger = {
  async logAccessAttempt(data: SecurityLogData) {
    const level = data.success ? "info" : "warn";
    await logViaAPI({
      level,
      message: data.success
        ? `Access granted: ${data.action}`
        : `Access denied: ${data.action}${data.reason ? ` - ${data.reason}` : ""}`,
      context: {
        page: data.path || "unknown",
        action: data.action,
        component: "SecurityLogger",
      },
      user: {
        userId: data.userId,
        email: data.email,
        ip: data.ip,
        userAgent: data.userAgent,
      },
    });
  },

  async logLoginAttempt(email: string, success: boolean, reason?: string, userId?: string) {
    const level = success ? "info" : "warn";
    await logViaAPI({
      level,
      message: success
        ? `Login successful: ${email}`
        : `Login failed: ${email}${reason ? ` - ${reason}` : ""}`,
      context: {
        page: "/login",
        action: success ? "login_success" : "login_failed",
        component: "SecurityLogger",
      },
      user: {
        userId: userId,
        email: email,
      },
    });
  },

  async logAdminAction(action: string, userId?: string, email?: string, details?: object) {
    await logViaAPI({
      level: "info",
      message: `Admin action: ${action}`,
      context: {
        page: "/Admin",
        action: action,
        component: "SecurityLogger",
        additionalInfo: details,
      },
      user: {
        userId: userId,
        email: email,
      },
    });
  },

  async logUnauthorizedAccess(
    path: string,
    userId?: string,
    email?: string,
    requiredRole?: string
  ) {
    await logViaAPI({
      level: "warn",
      message: `Unauthorized access attempt: ${path}${requiredRole ? ` (Required: ${requiredRole})` : ""}`,
      context: {
        page: path,
        action: "unauthorized_access",
        component: "SecurityLogger",
      },
      user: {
        userId: userId,
        email: email,
      },
    });
  },
};


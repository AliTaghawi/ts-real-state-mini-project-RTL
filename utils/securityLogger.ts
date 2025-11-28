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

export const securityLogger = {
  async logAccessAttempt(data: SecurityLogData) {
    const level = data.success ? "info" : "warn";
    await logger[level]({
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
    await logger[level]({
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
    await logger.info({
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
    await logger.warn({
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


import { logger } from "./logger";
import { NextRequest } from "next/server";

// Helper function to log debug information for API requests
export const debugLogger = {
  async logRequest(
    req: NextRequest | Request,
    context: {
      endpoint: string;
      method: string;
      userId?: string;
      email?: string;
      additionalInfo?: object;
    }
  ) {
    try {
      const url = req instanceof NextRequest ? req.url : req.url || "unknown";
      const method = context.method || (req instanceof NextRequest ? req.method : "unknown");
      const ip =
        (req instanceof NextRequest
          ? req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip")
          : "unknown") || "unknown";
      const userAgent =
        (req instanceof NextRequest
          ? req.headers.get("user-agent")
          : "unknown") || "unknown";
      const referer =
        (req instanceof NextRequest ? req.headers.get("referer") : undefined) || undefined;

      await logger.debug({
        message: `API Request: ${method} ${context.endpoint}`,
        context: {
          page: context.endpoint,
          action: `${method.toLowerCase()}_request`,
          component: "APIRoute",
          additionalInfo: {
            ...context.additionalInfo,
            method,
            url,
          },
        },
        request: {
          method,
          url,
          path: context.endpoint,
          referer,
        },
        user: {
          userId: context.userId,
          email: context.email,
          ip,
          userAgent,
        },
      });
    } catch (err) {
      // Silently fail to avoid recursion
    }
  },

  async logResponse(
    endpoint: string,
    method: string,
    statusCode: number,
    context?: {
      userId?: string;
      email?: string;
      responseTime?: number;
      additionalInfo?: object;
    }
  ) {
    try {
      await logger.debug({
        message: `API Response: ${method} ${endpoint} - Status: ${statusCode}`,
        context: {
          page: endpoint,
          action: `${method.toLowerCase()}_response`,
          component: "APIRoute",
          additionalInfo: {
            ...context?.additionalInfo,
            statusCode,
            responseTime: context?.responseTime,
          },
        },
        request: {
          method,
          path: endpoint,
        },
        user: {
          userId: context?.userId,
          email: context?.email,
        },
      });
    } catch (err) {
      // Silently fail to avoid recursion
    }
  },
};


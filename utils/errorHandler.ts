import { logger } from "./logger";

export const handleError = (
  error: Error | unknown,
  context?: {
    page?: string;
    action?: string;
    component?: string;
    additionalInfo?: object;
  }
) => {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred";
  const errorObj = error instanceof Error ? error : undefined;

  logger.error({
    message: errorMessage,
    error: errorObj,
    context: {
      ...context,
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
    },
    request: {
      url: typeof window !== "undefined" ? window.location.href : undefined,
      path: typeof window !== "undefined" ? window.location.pathname : undefined,
      referer: typeof document !== "undefined" ? document.referrer : undefined,
    },
  });
};

// Example usage in components:
// try {
//   // some code
// } catch (error) {
//   handleError(error, {
//     component: "ComponentName",
//     action: "actionName",
//   });
// }


import { Request, Response, NextFunction } from "express";

/**
 * Adds a correlation ID to every request for tracing.
 */
export function addRequestId(req: Request, _: Response, next: NextFunction) {
  (req as any).requestId = Math.random().toString(36).substring(2, 10);
  console.log(
    `[TRACE] → ${req.method} ${req.originalUrl} [${(req as any).requestId}]`,
  );
  next();
}

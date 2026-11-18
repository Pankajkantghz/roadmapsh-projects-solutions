import { NextFunction, Request, Response } from "express";
import { ZodType, ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export const validate = (schema: ZodType) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (typeof validated === "object" && validated !== null) {
        const parsed = validated as {
          body?: Request["body"];
          query?: Request["query"];
          params?: Request["params"];
        };
        if (parsed.body !== undefined) req.body = parsed.body;
        if (parsed.query !== undefined) {
          Object.defineProperty(req, "query", {
            value: parsed.query,
            writable: true,
            configurable: true,
            enumerable: true,
          });
        }
        if (parsed.params !== undefined) req.params = parsed.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Grab the primary validation error message directly
        const errorMessage = error.issues[0]?.message || "Validation failed";

        return next(new AppError(errorMessage, 400));
      }

      next(error);
    }
  };
};

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
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

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

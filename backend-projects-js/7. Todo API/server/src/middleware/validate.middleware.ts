import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod"; // 1. Fixed the import

export const validate = (schema: z.ZodTypeAny) => {
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
        const formattedErrors = error.issues.map((err) => ({
          field: err.path[1] || "request",
          message: err.message,
        }));

        res.status(400).json({ status: "error", errors: formattedErrors });
        return;
      }

      res.status(500).json({
        status: "error",
        message: "Internal engine data validation failure",
      });
      return;
    }
  };
};

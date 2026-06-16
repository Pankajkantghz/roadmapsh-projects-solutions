import type { Request, Response, NextFunction } from "express"; 
import { ZodError, type ZodTypeAny } from "zod"; // Changed to ZodTypeAny from the main zod package

export const validate = (validator: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await validator.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.slice(1).join('.'), 
          message: err.message,
        }));

        res.status(400).json({
          status: 'fail',
          errors: formattedErrors,
        });
        return;
      }
      return next(error);
    }
  };
};
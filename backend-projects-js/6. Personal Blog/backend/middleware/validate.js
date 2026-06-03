import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);

    next();
  } catch (error) {
    //
    // Zod validation
    //
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => {
        const field = issue.path[0];

        if (issue.code === "invalid_type") {
          return `${field.charAt(0).toUpperCase()}${field.slice(
            1,
          )} is required`;
        }

        return issue.message;
      });

      return res.status(400).json({
        success: false,

        errors,
      });
    }

    next(error);
  }
};

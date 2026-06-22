import { z } from "zod";

export const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // 1. Body remains a simple mutable property assignment
    req.body = parsed.body;

    // 2. Express 5 Fix: Force define 'query' to bypass the read-only getter constraint safely
    Object.defineProperty(req, "query", {
      value: parsed.query,
      writable: true,
      configurable: true,
      enumerable: true,
    });

    // 3. Force define 'params' to protect against future version updates as well
    Object.defineProperty(req, "params", {
      value: parsed.params,
      writable: true,
      configurable: true,
      enumerable: true,
    });

    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = (error.errors || []).map((err) => ({
        field: err.path[1] || err.path[0] || "unknown",
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: formattedErrors,
      });
    }

    console.error("🔥 True Underlying Runtime Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

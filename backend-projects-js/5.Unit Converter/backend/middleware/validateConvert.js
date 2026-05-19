import { z } from "zod";

const convertSchema = z.object({
  type: z.enum(["length", "weight", "temperature"]),

  value: z.number(),

  from: z.string().min(1),

  to: z.string().min(1),
});

export const validateConvert = (req, res, next) => {
  try {
    convertSchema.parse(req.body);

    next();
  } catch (error) {
    return res.status(400).json({
      msg: error.errors[0].message,
    });
  }
};

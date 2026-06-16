import dotenv from "dotenv";
import z from "zod";


dotenv.config();


const envSchema = z.object({
  PORT: z.string().default("3000"),
  DB_HOST: z.string({ message: "DB_HOST is missing in .env" }),
  DB_USER: z.string({ message: "DB_USER is missing in .env" }),
  DB_PASSWORD: z.string({ message: "DB_PASSWORD is missing in .env" }),
  DB_NAME: z.string({ message: "DB_NAME is missing in .env" }),
});


export const env = envSchema.parse(process.env);

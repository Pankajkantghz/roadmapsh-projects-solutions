import { ObjectId } from "mongoose";

declare global {
  namespace Express {
    interface User {
      id: string;
      _id?: ObjectId | string;
      email?: string;
    }
    interface Request {
      user?: User;
    }
  }
}
export {};

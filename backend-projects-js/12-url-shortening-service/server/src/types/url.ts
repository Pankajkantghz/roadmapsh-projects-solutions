import { Document, Types } from "mongoose";

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  user: Types.ObjectId | string;
  clicks: number;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  password?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUrlAnalyticsResponse {
  shortCode: string;
  clicks: number;
  createdAt: Date;
}

export interface AnalyticsPayload {
  browser: string;
  os: string;
  device: string;
  referrer: string;
}

export interface FilterQueries {
  search?: string;
  tag?: string;
  isFavorite?: boolean;
  page: number;
  limit: number;
}

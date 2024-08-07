// utils/asyncHandler.ts
import { Context } from "hono";
import { ApiResponse } from "./apiResponse";

export const asyncHandler = (fn: (c: Context) => Promise<any>) => {
  return async (c: Context) => {
    try {
      await fn(c);
    } catch (error) {
      console.error(error);
      c.json(new ApiResponse(500, {}, "Internal Server Error"), 500);
    }
  };
};

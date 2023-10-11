import { Request, Response, NextFunction } from "express";

declare module './error-handling/error-handler' {
  interface CustomError {
    status?: number;
    message?: string;
  }

  export default function errorHandler(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}

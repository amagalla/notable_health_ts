import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status: number = err.status || 500;
  let message: string = err.message || "Internal Server Error";

  res.status(status).json({ error: message });
};

export default errorHandler;

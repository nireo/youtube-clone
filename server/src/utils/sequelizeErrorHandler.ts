import * as express from "express";
import { BaseError } from "sequelize/types";

export function handleSequelizeBaseError(
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (error instanceof BaseError) {
    return res.status(500).json({ message: "Sequelize error " });
  }

  next(error);
}

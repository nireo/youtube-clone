import * as express from "express";
import Sequelize from "sequelize";

export function handleSequelizeBaseError(
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (error instanceof Sequelize.ValidationError) {
    return res.status(500).json({ message: "Sequelize error " });
  }

  next(error);
}

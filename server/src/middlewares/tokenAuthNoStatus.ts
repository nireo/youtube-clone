// This is the version of the token middleware which doesn't send a status code
// this just helps when getting information on pages which may need user info
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../sequelize";

const authenticateTokenNoStatus = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!authHeader || !token) {
    next();
  }
  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    async (err: any, user: any) => {
      if (!user.username) next();

      // we could store the user in the token, but this way the information is surely up-to-date
      const requestUser = await User.findOne({
        where: { username: user.username }
      });
      req.user = requestUser;
      next();
    }
  );
};

export default authenticateTokenNoStatus;

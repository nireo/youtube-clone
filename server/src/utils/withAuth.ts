import jwt from "jsonwebtoken";
import { User } from "../sequelize";
import { Response, NextFunction } from "express";

const withAuth = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  console.log(req.cookies.token);

  if (!token) {
    return res.status(401);
  } else {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET as string,
      async (err: any, user: any) => {
        if (err) return res.status(401);
        else {
          const reqUser = await User.findOne({
            where: { username: user.username }
          });
          req.user = reqUser;
          next();
        }
      }
    );
  }
};

// For routes where the information changes, if the user is logged in.
export const optionalAuth = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    next();
  } else {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET as string,
      async (err: any, user: any) => {
        if (err) return res.status(401);
        else {
          const reqUser = await User.findOne({
            where: { username: user.username }
          });
          req.user = reqUser;
          next();
        }
      }
    );
  }
};

export default withAuth;

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../sequelize';

const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    async (err: any, username: any) => {
      if (err) return res.sendStatus(403);

      const user = await User.findOne({ where: { username } });
      req.user = user;
      next();
    }
  );
};

export default authenticateToken;

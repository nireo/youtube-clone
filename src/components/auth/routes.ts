import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User } from '../../sequelize';
import generateToken from '../../utils/generateToken';
import authenticateToken from '../../middlewares/tokenAuth';
import jwt from 'jsonwebtoken';

const router: express.Router = express.Router();

router.post(
  '/register',
  async (req: express.Request, res: express.Response) => {
    try {
      // check for user conflicts
      const exists = await User.findOne({
        where: { username: req.body.username },
      });
      if (exists) {
        return res.status(409).json({ message: 'Username is already used' });
      }

      bcrypt.hash(req.body.password, 10, async (error, hash) => {
        if (error) return res.status(500).send(error);

        const user = await User.create({
          username: req.body.username,
          password: hash,
          id: uuidv4(),
        });

        res.status(200).json(user);
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    const user: any = await User.findOne({
      where: { username: req.body.username },
    });

    console.log('he');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const passwordMatches = await bcrypt.compare(
      req.body.password,
      user.password
    );

    console.log('hee');

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Credentials do not match.' });
    }

    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.TOKEN_SECRET as string
    );

    res.json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get(
  '/me',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export default router;

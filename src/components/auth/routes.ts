import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User } from '../../sequelize';

const router: express.Router = express.Router();

router.post('/register', (req: express.Request, res: express.Response) => {
  try {
    bcrypt.hash(req.body.password, 10, async (error, hash) => {
      if (error) return res.status(500).send(error);

      const user = await User.create({
        username: req.body.username,
        password: hash,
        id: uuidv4(),
      });

      res.status(200).json({ data: user });
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;

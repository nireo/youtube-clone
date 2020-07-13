import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../sequelize';

const router: express.Router = express.Router();

router.post('/avatar', async (req: express.Request, res: express.Response) => {
  try {
    if (!req.files) {
      return res.send({
        status: false,
        message: 'No avatar image was provided',
      });
    }

    let avatar: any = req.files.avatar;
    avatar.mv('./avatars/' + uuidv4());

    res.send({
      status: true,
      message: 'Avatar successfully uploaded',
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/users', async (req: express.Request, res: express.Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../sequelize';
import { Video } from '../../sequelize';
import authenticateToken from '../../middlewares/tokenAuth';

const router: express.Router = express.Router();

// THE USER COMPONENT IS BASICALLY THE CHANNEL COMPONENT
router.get(
  '/videos/:userId',
  async (req: express.Request, res: express.Response) => {
    try {
      const user = await User.findOne({ where: { id: req.params.userId } });
      if (!user) {
        return res.status(404).json({ message: 'That user does not exist' });
      }

      const videos = await Video.findAll({
        where: { userId: req.params.userId },
      });
      if (!videos) {
        return res.status(404).json({ message: 'No videos found' });
      }

      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

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

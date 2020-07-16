import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User, Video, Subscription } from '../../sequelize';
import authenticateToken from '../../middlewares/tokenAuth';
import getFileExtension from '../../utils/getFileExtension';

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

router.post(
  '/avatar',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      if (!req.files) {
        return res.send({
          status: false,
          message: 'No avatar image was provided',
        });
      }

      const avatar: any = req.files.avatar;
      const avatarFilename = `${req.user.id}.${getFileExtension(avatar.name)}`;
      avatar.mv('./avatars/' + avatarFilename);

      req.user.avatar = avatarFilename;
      await req.user.save();

      res.send({
        status: true,
        message: 'Avatar successfully uploaded',
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

router.get('/users', async (req: express.Request, res: express.Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.delete(
  '/',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) {
        return res.status(404);
      }

      await user.destroy();
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

router.post(
  '/subscribe/:userId',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const user: any = await User.findOne({
        where: { id: req.params.userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // check if there is a existing subscription model
      const exists = await Subscription.findOne({
        where: { subscriberId: req.user.id, subscribedId: user.id },
      });

      if (exists) {
        return res.status(409).json({ message: 'Subscription already exists' });
      }

      await Subscription.create({
        id: uuidv4(),
        subscriberId: req.user.id,
        subscribedId: user.id,
      });

      res.status(204);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

router.delete(
  '/subscribe/:userId',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const user: any = await User.findOne({
        where: { id: req.params.userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const subscription = await Subscription.findOne({
        where: { subscriberId: req.user.id, subscribedId: user.id },
      });

      if (!subscription) {
        return res.status(404).json({ message: "Subscription doesn't exist " });
      }

      await subscription.destroy();
      res.status(204);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

router.get(
  '/subscription',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const subscriptions: any = await Subscription.findAll({
        where: { subscriberId: req.user.id },
      });

      let users: any = [];
      subscriptions.forEach(async (subscription: any) => {
        const user = await User.findOne({
          where: { id: subscription.subscribedId },
        });
        if (!user) {
          return res
            .status(404)
            .json({ message: 'Problem with subscription entry' });
        }

        users = users.append(user);
      });

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export default router;

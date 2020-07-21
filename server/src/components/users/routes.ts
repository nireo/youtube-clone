import express from "express";
import { v4 as uuidv4 } from "uuid";
import { User, Video, Subscription } from "../../sequelize";
import authenticateToken from "../../middlewares/tokenAuth";
import getFileExtension from "../../utils/getFileExtension";
import fs from "fs";

const router: express.Router = express.Router();

// THE USER COMPONENT IS BASICALLY THE CHANNEL COMPONENT
router.get(
  "/videos/:userId",
  async (req: express.Request, res: express.Response) => {
    try {
      const user = await User.findOne({ where: { id: req.params.userId } });
      if (!user) {
        return res.status(404);
      }

      const videos = await Video.findAll({
        where: { userId: req.params.userId }
      });

      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

router.post(
  "/avatar",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      if (!req.files) {
        return res.send({
          status: false,
          message: "No avatar image was provided"
        });
      }

      const avatar: any = req.files.avatar;
      const avatarFilename = `${req.user.id}.${getFileExtension(avatar.name)}`;
      avatar.mv("./avatars/" + avatarFilename);

      req.user.avatar = avatarFilename;
      await req.user.save();

      res.send({
        status: true,
        message: "Avatar successfully uploaded"
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

// removes the users hole avatar thus setting it to the default avatar
router.delete(
  "/avatar",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      // check if the avatar already is null
      if (req.user.avatar === null) {
        return res.status(204);
      }

      //remove the file from the file-system
      fs.unlink(`./avatars/${req.user.avatar}`, err => {
        if (err) return res.status(500).json({ message: err });
      });

      req.user.avatar = null;
      await req.user.save();
      return res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.get("/users", async (req: express.Request, res: express.Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.delete(
  "/",
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
  "/subscribe/:userId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const user: any = await User.findOne({
        where: { id: req.params.userId }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // check if there is a existing subscription model
      const exists = await Subscription.findOne({
        where: { subscriberId: req.user.id, subscribedId: user.id }
      });

      if (exists) {
        return res.status(409).json({ message: "Subscription already exists" });
      }

      user.subscribers++;
      await user.save();

      const subscription = await Subscription.create({
        id: uuidv4(),
        subscriberId: req.user.id,
        subscribedId: user.id
      });

      res.status(204).json(subscription);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

router.delete(
  "/subscribe/:userId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const user: any = await User.findOne({
        where: { id: req.params.userId }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const subscription = await Subscription.findOne({
        where: { subscriberId: req.user.id, subscribedId: user.id }
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
  "/subscription",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const subscriptions: any = await Subscription.findAll({
        where: { subscriberId: req.user.id }
      });

      let users: any = [];
      for (let i = 0; i < subscriptions.length; ++i) {
        const user = await User.findOne({
          where: { id: subscriptions[i].subscribedId }
        });

        if (!user) {
          return res
            .status(404)
            .json({ message: "Problem with subscription entry" });
        }

        users = [...users, user];
      }

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

// get user channel information and all the videos that the user has published
router.get(
  "/channel/:userId",
  async (req: express.Request, res: express.Response) => {
    try {
      const { userId } = req.params;
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404);
      }

      const userVideos = await Video.findAll({ where: { userId } });
      res.status(200).json({ user, videos: userVideos });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

export default router;

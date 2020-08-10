import express from "express";
import { v4 as uuidv4 } from "uuid";
import {
  User,
  Video,
  Subscription,
  Playlist,
  VideoLike
} from "../../sequelize";
import authenticateToken from "../../middlewares/tokenAuth";
import getFileExtension from "../../utils/getFileExtension";
import fs from "fs";
import withAuth from "../../utils/withAuth";

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

// way to update username and channel description
router.patch(
  "/update",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      if (req.body.username) {
        // check if a user with the same username already exists
        const conflicts = await User.findOne({
          where: { username: req.body.username }
        });
        if (conflicts) {
          return res.status(409);
        }

        req.user.username = req.body.username;
      }

      if (req.body.description) {
        req.user.description = req.body.description;
      }

      await req.user.save();
      res.status(200).json(req.user);
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
      res.status(204);
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
  withAuth,
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

router.post(
  "/watch-later/:videoId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const { videoId } = req.params;

      // check that the video exists
      const video = await Video.findOne({ where: { id: videoId } });
      if (!video) {
        return res.status(404);
      }

      // check that the video isn't already in the watch later list
      const found = req.user.watchLater.find((id: string) => id === videoId);
      if (found) {
        return res.status(409);
      }

      req.user.watchLater = req.user.watchLater.concat(videoId);
      await req.user.save();

      return res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.get(
  "/watch-later",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      let videos: any = [];
      for (let i = 0; i < req.user.watchLater.length; ++i) {
        const video = await Video.findOne({
          where: { id: req.user.watchLater[i] },
          include: User
        });
        if (!video) {
          // problem with the watch later array or video has been deleted
          return res.status(404);
        }

        videos = [...videos, video];
      }

      res.status(200).json(videos);
    } catch (error) {
      return res.status(500).json({ messsage: error });
    }
  }
);

router.delete(
  "/watch-later/:videoId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      req.user.watchLater.filter((id: string) => id !== req.params.videoId);
      await req.user.save();

      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.get(
  "/history",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      let videos: any = [];
      for (let i = 0; i < req.user.history.length; ++i) {
        const video = await Video.findOne({
          where: { id: req.user.history[i] },
          include: User
        });
        if (!video) {
          return res.status(404);
        }

        videos = [...videos, video];
      }

      res.status(200).json(videos);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

// This combines many different routes into so that the library page is easier to create
router.get(
  "/library",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      // get history
      let historyVideos: any = [];
      for (let i = 0; i < req.user.history.length; ++i) {
        const video = await Video.findOne({
          where: { id: req.user.history[i] }
        });

        if (!video) {
          return res.status(404);
        }

        historyVideos = [...historyVideos, video];
      }

      // get watch later
      let watchLaterVideos: any = [];
      for (let i = 0; i < req.user.watchLater.length; ++i) {
        const video = await Video.findOne({
          where: { id: req.user.history[i] }
        });

        if (!video) {
          return res.status(404);
        }

        watchLaterVideos = [...watchLaterVideos, video];
      }

      // get playlists
      const playlists = await Playlist.findAll({
        where: { userId: req.user.id }
      });

      // get liked videos
      const videoLikes: any = await VideoLike.findAll({
        where: { userId: req.user.id, like: true }
      });
      let likedVideos: any = [];
      for (let i = 0; i < videoLikes.length; ++i) {
        const video = await Video.findOne({
          where: { id: videoLikes[i].videoId }
        });
        likedVideos = [...likedVideos, video];
      }

      res.status(200).json({
        history: historyVideos,
        watchLater: watchLaterVideos,
        playlists,
        liked: likedVideos
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.post(
  "/banner",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      if (!req.files.banner) {
        return res.send({
          status: false,
          message: "No banner image was provided"
        });
      }

      const banner: any = req.files.banner;
      const bannerFilename = `${req.user.id}.${getFileExtension(banner.name)}`;
      banner.mv("./banners/" + bannerFilename);

      req.user.banner = bannerFilename;
      await req.user.save();

      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.delete(
  "/banner",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      if (req.user.banner === null) {
        return res.status(204);
      }

      fs.unlink(`./avatars/${req.user.banner}`, err => {
        if (err) return res.status(500).json({ message: err });
      });

      req.user.banner = null;
      await req.user.save();
      return res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.get(
  "/subscriptions/:userId",
  async (req: express.Request, res: express.Response) => {
    try {
      const subscriptions: any = await Subscription.findAll({
        where: { subscriberId: req.params.userId }
      });

      let users: any = [];
      for (let i = 0; i < subscriptions.length; ++i) {
        const user = await User.findOne({
          where: { id: subscriptions[i].subscribedId }
        });

        users = [...users, user];
      }

      res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.get(
  "/liked",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const videoLikes: any = await VideoLike.findAll({
        where: { userId: req.user.id, like: true }
      });
      let likedVideos: any = [];
      for (let i = 0; i < videoLikes.length; ++i) {
        const video = await Video.findOne({
          where: { id: videoLikes[i].videoId }
        });
        likedVideos = [...likedVideos, video];
      }

      return res.status(200).json(likedVideos);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

export default router;

import express from "express";
import { v4 as uuidv4 } from "uuid";
import { Playlist, User, Video } from "../../sequelize";
import withAuth from "../../utils/withAuth";

const router: express.Router = express.Router();

router.post("/", withAuth, async (req: any, res: express.Response) => {
  try {
    const newPlaylistModel = await Playlist.create({
      id: uuidv4(),
      title: req.body.title,
      userId: req.user.id
    });

    res.status(200).json(newPlaylistModel);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.delete(
  "/:playlistId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      const playlist: any = await Playlist.findOne({
        where: { id: req.params.playlistId }
      });

      if (!playlist) {
        return res.status(403);
      }

      if (req.user.id !== playlist.userId) {
        return res.status(403);
      }

      await playlist.destroy();
      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.patch(
  "/:playlistId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      const { playlistId } = req.params;
      const { title, description, videoThumbnail } = req.body;
      const playlist: any = await Playlist.findOne({
        where: { id: playlistId }
      });
      if (!playlist) {
        return res.status(404);
      }

      if (req.user.id !== playlist.userId) {
        return res.status(403);
      }

      if (title) {
        playlist.title = title;
      }

      if (description) {
        playlist.description = description;
      }

      if (videoThumbnail) {
        playlist.videoThumbnail = videoThumbnail;
      }

      await playlist.save();
      res.status(200).json(playlist);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.get("/user/:userId", async (req: any, res: express.Response) => {
  const { userId } = req.params;
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404);
  }

  const userPlaylists = await Playlist.findAll({ where: { userId: userId } });
  res.status(200).json(userPlaylists);
});

router.get(
  "/playlist/:playlistId",
  async (req: express.Request, res: express.Response) => {
    try {
      const playlist: any = await Playlist.findOne({
        where: { id: req.params.playlistId }
      });

      if (!playlist) {
        return res.status(404);
      }

      let videos: any = [];
      for (let i = 0; i < playlist.videos.length; ++i) {
        const video = await Video.findAll({
          where: { id: playlist.videos[i] },
          include: User
        });
        if (!video) {
          return res.status(404);
        }

        videos = [...videos, video];
      }

      res.status(200).json({ playlist, videos });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.post(
  "/video/:playlistId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      const { playlistId } = req.params;
      const { videoId } = req.body;

      const playlist: any = await Playlist.findOne({
        where: { id: playlistId }
      });
      if (!playlist) {
        return res.status(404);
      }

      if (req.user.id !== playlist.userId) {
        return res.status(403);
      }

      // we don't need the values, just to check if the video exists
      const video = await Video.findOne({ where: { id: videoId } });
      if (!video) {
        return res.status(404);
      }

      playlist.videos = playlist.videos.concat(videoId);
      await playlist.save();

      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.delete(
  "/video/:playlistId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      const { playlistId } = req.params;
      const { videoId } = req.body;

      const playlist: any = await Playlist.findOne({
        where: { id: playlistId }
      });
      if (!playlist) {
        return res.status(404);
      }

      if (req.user.id !== playlist.userId) {
        return res.status(403);
      }

      const found = playlist.videos.find((id: string) => id === videoId);
      if (!found) {
        return res.status(404);
      }

      playlist.videos.filter((id: string) => id !== videoId);
      await playlist.save();
      res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

export default router;

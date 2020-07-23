import express from "express";
import { v4 as uuidv4 } from "uuid";
import authenticateToken from "../../middlewares/tokenAuth";
import { Playlist, User, Video } from "../../sequelize";

const router: express.Router = express.Router();

router.post("/", authenticateToken, async (req: any, res: express.Response) => {
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
  authenticateToken,
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
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const { playlistId } = req.params;
      const { title, description } = req.body;
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

  const userPlaylists = await Playlist.findAll({ where: { id: userId } });
  res.status(200).json(userPlaylists);
});

router.post(
  "/video/:playlistId",
  authenticateToken,
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

export default router;

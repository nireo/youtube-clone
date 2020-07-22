import express from "express";
import { v4 as uuidv4 } from "uuid";
import authenticateToken from "../../middlewares/tokenAuth";
import { Playlist } from "../../sequelize";

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
      const playlist = await Playlist.findOne({
        where: { id: req.params.playlistId }
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

export default router;

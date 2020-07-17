import express from "express";
import { v4 as uuidv4 } from "uuid";
import { Video, VideoLike } from "../../sequelize";
import authenticateToken from "../../middlewares/tokenAuth";
import fs from "fs";
import getFileExtension from "../../utils/getFileExtension";

const router: express.Router = express.Router();

router.post("/", authenticateToken, async (req: any, res: express.Response) => {
  try {
    if (!req.files.video || !req.files.thumbnail) {
      res.send({
        status: false,
        message: "No video was provided"
      });
    } else {
      const uuid = uuidv4();
      const video: any = req.files.video;
      const thumbnail: any = req.files.thumbnail;

      // get file extension
      const videoExtension = getFileExtension(video.name);
      const thumbnailExtension = getFileExtension(thumbnail.name);

      // store the video with the name of a unique id, in the future
      // this id will be the same as the one pointing to the video information
      // in the database
      video.mv("./videos/" + `${uuid}.${videoExtension}`);
      thumbnail.mv("./thumbnails/" + `${uuid}.${thumbnailExtension}`);

      // we dont need to store the whole name of the thumbnail or video, since the name is the video id,
      // with a certain extension. That's why we only store the extensions
      const newVideoModel = await Video.create({
        id: uuid,
        title: req.body.title,
        description: req.body.description ? req.body.description : null,
        userId: req.user.id,
        fileExtension: videoExtension,
        thumbnail: thumbnailExtension
      });

      res.send({
        status: true,
        video: newVideoModel
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete(
  "/:videoId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const video: any = await Video.findOne({
        where: { id: req.body.videoId }
      });
      if (!video) {
        res.status(403).json({ message: "Video not found" });
      }

      // check user ownership
      if (req.user.id != video.userId) {
        return res.status(401).json({ message: "Forbidden" });
      }

      // remove the video file from the file-system
      fs.unlink(`./videos/${req.body.videoId}`, err => {
        if (err) return res.status(500).json({ message: err });
      });

      await video.destroy();
      res.status(204);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.patch(
  "/:action/:videoId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const { action, videoId } = req.params.action;
      if (action !== "like" || action !== "dislike") {
        return res.status(400).json({ message: "No action provided" });
      }

      const video: any = await Video.findOne({
        where: { id: videoId }
      });

      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // check for existing like model
      const videoLike: any = await VideoLike.findOne({
        where: { userId: req.user.id, videoId }
      });

      if (videoLike) {
        // change like to dislike or remove like/dislike
        if (video.like && action === "dislike") {
          video.likes -= 1;
          video.dislikes += 1;

          videoLike.like = false;
        } else if (videoLike.like === false && action === "like") {
          video.likes += 1;
          video.dislikes -= 1;

          videoLike.like = true;
        } else if (videoLike.like && action === "like") {
          await videoLike.destroy();
          return res.status(204);
        } else if (videoLike.like === false && action === "dislike") {
          await videoLike.destroy();
          return res.status(204);
        } else {
          return res.status(400).json({ message: "Bad request" });
        }

        await video.save();
        await videoLike.save();
        return res.status(204);
      }

      await VideoLike.create({
        id: uuidv4(),
        userId: req.user.id,
        videoId,
        like: action === "like"
      });

      video.likes += req.params.action === "like" ? 1 : -1;
      video.dislikes += req.params.action !== "like" ? 1 : -1;
      res.status(204);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.patch(
  "/:videoId",
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const video: any = await Video.findOne({
        where: { id: req.params.videoId }
      });

      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // check ownership
      if (req.user.id !== video.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (!req.body.title) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }

      video.description = req.body.description;
      video.title = req.body.title;

      await video.save();
      res.status(200).json(video);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export default router;

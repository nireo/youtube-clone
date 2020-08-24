import express from "express";
import { v4 as uuidv4 } from "uuid";
import { Video, VideoLike, Comment, User } from "../../sequelize";
import authenticateToken from "../../middlewares/tokenAuth";
import fs from "fs";
import getFileExtension from "../../utils/getFileExtension";
import * as sequelize from "sequelize";
import withAuth, { optionalAuth } from "../../utils/withAuth";

const router: express.Router = express.Router();

router.post("/", withAuth, async (req: any, res: express.Response) => {
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
  withAuth,
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
  "/rate/like/:videoId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      const { videoId } = req.params;
      const video: any = await Video.findOne({ where: { id: videoId } });
      if (!video) return res.status(404);

      // check for a existing like so that we can then remove it
      const videoLike: any = await VideoLike.findOne({
        where: { userId: req.user.id, videoId }
      });

      if (videoLike) {
        // remove dislike
        if (!videoLike.like) {
          videoLike.like = true;
          video.likes++;
          video.dislikes--;
        } else {
          await videoLike.destroy();
          return res.status(204);
        }
      }

      await VideoLike.create({
        id: uuidv4(),
        userId: req.user.id,
        videoId,
        like: true
      });

      video.likes++;
      await video.save();
      return res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.patch(
  "/rate/dislike/:videoId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      const { videoId } = req.params;
      const video: any = await Video.findOne({ where: { id: videoId } });
      if (!video) return res.status(404);

      const videoLike: any = await VideoLike.findOne({
        where: { userId: req.user.id, videoId }
      });
      if (videoLike) {
        if (videoLike.like) {
          videoLike.like = false;
          video.likes++;
          video.dislikes--;
        } else {
          await videoLike.destroy;
          return res.status(204);
        }
      }

      await VideoLike.create({
        id: uuidv4(),
        userId: req.user.id,
        videoId,
        like: false
      });

      video.dislikes++;
      return res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.patch(
  "/video/:videoId",
  withAuth,
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

router.get("/", async (_req: express.Request, res: express.Response) => {
  try {
    // find all public videos, this excludes private and only with link videos
    const videos = await Video.findAll({
      where: { privacyLevel: 0 },
      include: User
    });
    res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.get("/search", async (req: express.Request, res: express.Response) => {
  try {
    let searchQuery = req.query.search;
    console.log(searchQuery);

    const matchingVideos = await Video.findAll({
      where: {
        title: { [sequelize.Op.like]: "%" + searchQuery + "%" },
        privacyLevel: 0
      },
      include: User
    });

    if (!matchingVideos) {
      return res.status(404);
    }

    // get matching users
    const matchingUsers = await User.findAll({
      where: { username: { [sequelize.Op.like]: "%" + searchQuery + "%" } }
    });

    res.status(200).json({ videos: matchingVideos, users: matchingUsers });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// This route exists to make displaying a video on the front-end easier, since we only need
// one request instead of 2. (get video comments and get video info)
// this controller also handles adding views to videos
router.get(
  "/watch/:videoId",
  optionalAuth,
  async (req: any, res: express.Response) => {
    try {
      const { videoId } = req.params;
      const video: any = await Video.findOne({
        where: { id: videoId },
        include: {
          model: User
        }
      });

      if (!video) {
        return res.status(404);
      }

      // 0=no likes, 1=liked, 2=disliked
      let likeStatus: number = 0;

      // if the video is private return not found
      if (video.privacyLevel === 3) return res.status(404);

      video.views++;
      await video.save();

      if (req.user) {
        // check that the video isn't already in the history
        const found = req.user.history.find((id: string) => id === videoId);
        if (!found) {
          req.user.history = req.user.history.concat(videoId);
          await req.user.save();
        }

        // check if the user has liked the video
        const videoLike: any = await VideoLike.findOne({
          where: { userId: req.user.id, videoId }
        });
        if (videoLike) {
          console.log("this user has liked");
          likeStatus += videoLike.like ? 1 : 2;
        }
      }

      // we return 404 if the video is not found, but the comments field can be empty so no need to check it
      const comments: any = await Comment.findAll({
        where: { videoId: videoId },
        include: User
      });

      // prepare a list of videos to watch next, this is just basically ~10 videos which don't include the current video
      let next = await Video.findAll({ limit: 10, include: User });
      // since sequelize doesn't have a feature to exclude query results, we need to filter it
      next = next.filter((v: any) => v.id !== videoId);

      return res.status(200).json({ video, comments, next, likeStatus });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

// get all the videos by the user who call this route
router.get("/me", withAuth, async (req: any, res: express.Response) => {
  try {
    const videos = await Video.findAll({ where: { userId: req.user.id } });
    res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// this route is the used when the user wants to edit a video that is why it has token checking
router.get(
  "/edit/:videoId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      const { videoId } = req.params;
      const video: any = await Video.findOne({ where: { id: videoId } });
      if (!video) {
        return res.status(404);
      }

      if (video.userId !== req.user.id) {
        return res.status(403);
      }

      const comments = await Comment.findAll({
        where: { videoId },
        include: User
      });

      res.status(200).json({ video, comments });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

// can't really bother with implementing an algorithm which rates how "trendy" some videos are
// since this is the case, we only get the videos with the most views
router.get(
  "/trending",
  async (_req: express.Request, res: express.Response) => {
    try {
      const videos = await Video.findAll({
        where: { privacyLevel: 0 },
        include: User
      });

      // sort by views
      videos.sort((a: any, b: any) => {
        return a.views - b.views;
      });

      res.status(200).json(videos);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.patch(
  "/thumbnail/:videoId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      if (!req.files.thumbnail) return res.status(400);
      const { videoId } = req.params;
      const video: any = await Video.findOne({ where: { id: videoId } });
      if (!video) {
        return res.status(404);
      }

      if (video.userId !== req.user.id) return res.status(403);

      // remove the old thumbnail
      fs.unlink(`./thumbnails/${video.id}.${video.thumbnail}`, err => {
        if (err) return res.status(500).json({ message: err });
      });

      const thumbnail: any = req.files.thumbnail;
      const thumbnailExtension = getFileExtension(thumbnail.name);
      thumbnail.mv(`./thumbnails/` + `${videoId}.${thumbnailExtension}`);

      video.thumbnail = thumbnailExtension;
      await video.save();
      return res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

router.patch(
  "/privacy/:videoId",
  withAuth,
  async (req: any, res: express.Response) => {
    try {
      const { videoId } = req.params;
      const { privacyLevel } = req.body;
      const video: any = await Video.findOne({ where: { id: videoId } });

      if (!video) return res.status(404);
      if (privacyLevel < 0 || privacyLevel > 3) return res.status(400);

      video.privacyLevel = privacyLevel;
      await video.save();
      return res.status(204);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

export default router;

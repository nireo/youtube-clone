import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Video } from '../../sequelize';
import authenticateToken from '../../middlewares/tokenAuth';
import fs from 'fs';

const router: express.Router = express.Router();

router.post('/', authenticateToken, async (req: any, res: express.Response) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No video was provided',
      });
    } else {
      const uuid = uuidv4();
      const video: any = req.files.video;

      // get file extension
      const splittedFileName: string[] = video.name.split('.');
      const fileExtension: string =
        splittedFileName[splittedFileName.length - 1];

      // store the video with the name of a unique id, in the future
      // this id will be the same as the one pointing to the video information
      // in the database
      video.mv('./videos/' + `${uuid}.${fileExtension}`);

      const newVideoModel = await Video.create({
        id: uuid,
        title: req.body.title,
        description: req.body.description ? req.body.description : null,
        userId: req.user.id,
        fileExtension,
      });

      res.send({
        status: true,
        video: newVideoModel,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete(
  '/:videoId',
  authenticateToken,
  async (req: any, res: express.Response) => {
    try {
      const video: any = await Video.findOne({
        where: { id: req.body.videoId },
      });
      if (!video) {
        res.status(403).json({ message: 'Video not found' });
      }

      // check user ownership
      if (req.user.id != video.userId) {
        return res.status(401).json({ message: 'Forbidden' });
      }

      // remove the video file from the file-system
      fs.unlink(`./videos/${req.body.videoId}`, (err) => {
        if (err) return res.status(500).json({ message: err });
      });

      await video.destroy();
      res.status(204);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export default router;

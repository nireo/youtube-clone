import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Video } from '../../sequelize';
import authenticateToken from '../../middlewares/tokenAuth';

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

      // store the video with the name of a unique id, in the future
      // this id will be the same as the one pointing to the video information
      // in the database
      video.mv('./videos/' + uuid);

      const newVideoModel = await Video.create({
        id: uuid,
        title: req.body.title,
        description: req.body.description ? req.body.description : null,
        userId: req.user.id,
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

export default router;

import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router: express.Router = express.Router();

router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No video was provided',
      });
    } else {
      let video: any = req.files.video;

      // store the video with the name of a unique id, in the future
      // this id will be the same as the one pointing to the video information
      // in the database
      video.mv('./videos/' + uuidv4());

      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: video.name,
          size: video.size,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;

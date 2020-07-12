import express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const PORT: number = 3001;
const app: express.Application = express();

// enable file upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('hello');
});

app.post('/video', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

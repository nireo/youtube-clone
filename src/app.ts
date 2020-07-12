import express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from 'cors';
import videoRoutes from './components/videos/routes';

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

app.use('/videos', videoRoutes);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

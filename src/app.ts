import express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import videoRoutes from './components/videos/routes';
import authRoutes from './components/auth/routes';
import userRoutes from './components/users/routes';
import commentRouter from './components/comments/routes';

const PORT: number = 3001;
const app: express.Application = express();
dotenv.config();

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
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRouter);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

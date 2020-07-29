import express from "express";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import videoRoutes from "./components/videos/routes";
import authRoutes from "./components/auth/routes";
import userRoutes from "./components/users/routes";
import commentRouter from "./components/comments/routes";
import playlistRouter from "./components/playlists/routes";
import notificationRouter from "./components/notifications/routes";
import communityRouter from "./components/community/routes";

const app: express.Application = express();
dotenv.config();

// middleware
app.use(
  fileUpload({
    createParentPath: true
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("tiny"));

app.use("/video", express.static("./videos"));
app.use("/avatars", express.static("./avatars"));
app.use("/thumbnails", express.static("./thumbnails"));
app.use("/banners", express.static("./banners"));

app.use("/videos", videoRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/comments", commentRouter);
app.use("/playlist", playlistRouter);
app.use("/notifications", notificationRouter);
app.use("/community", communityRouter);

export default app;

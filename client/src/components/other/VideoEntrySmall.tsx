import React from "react";
import { Video } from "../../interfaces/Video";
import Typography from "@material-ui/core/Typography";

type Props = {
  video: Video;
};

export const VideoEntrySmall: React.FC<Props> = ({ video }) => {
  return (
    <div style={{ width: "15rem" }}>
      <img
        alt="video-thumnail"
        src={`http://localhost:3001/thumbnails/${video.id}.${video.thumbnail}`}
        style={{ width: "15rem" }}
      />
      <Typography style={{ fontSize: "1rem" }}>
        <strong>{video.title}</strong>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {video.views} views • {new Date(video.createdAt).toDateString()}
      </Typography>
    </div>
  );
};

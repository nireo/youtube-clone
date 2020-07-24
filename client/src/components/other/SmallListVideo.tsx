import React from "react";
import { Video } from "../../interfaces/Video";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

type Props = {
  video: Video;
};

export const SmallListVideo: React.FC<Props> = ({ video }) => {
  return (
    <Link to={`/watch/${video.id}`} style={{ textDecoration: "none" }}>
      <div style={{ display: "flex", marginTop: "0.6rem" }}>
        <img
          alt="video-thumbnail"
          src={`http://localhost:3001/thumbnails/${video.id}.${video.thumbnail}`}
          style={{ width: "10rem" }}
        />
        <div style={{ marginLeft: "0.5rem" }}>
          <Typography style={{ fontSize: "1rem" }} color="textPrimary">
            {video.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {video.views} views •
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {new Date(video.createdAt).toDateString()}
          </Typography>
        </div>
      </div>
    </Link>
  );
};

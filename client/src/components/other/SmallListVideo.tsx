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
        <div style={{ width: "12rem", height: "7rem" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundSize: "100% 100%",
              backgroundImage: `url(http://localhost:3001/thumbnails/${video.id}.${video.thumbnail})`
            }}
          ></div>
        </div>
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

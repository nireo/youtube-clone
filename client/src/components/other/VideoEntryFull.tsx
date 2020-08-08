import React from "react";
import { Video } from "../../interfaces/Video";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

type Props = {
  video: Video;
};

// VideoEntryFull is the way video information is displayed on some pages, where one
// video takes up all of the width i.e. search page, history, trending
export const VideoEntryFull: React.FC<Props> = ({ video }) => {
  return (
    <Link
      to={`/edit/${video.id}`}
      style={{
        textDecoration: "none",
        marginBottom: "1rem"
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ width: "15rem", height: "8.5rem" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundSize: "100% 100%",
              backgroundImage: `url(http://localhost:3001/thumbnails/${video.id}.${video.thumbnail})`
            }}
          ></div>
        </div>
        <div style={{ marginLeft: "1rem" }}>
          <Typography variant="h6" color="textPrimary">
            {video.title}
          </Typography>
          {video.User ? (
            <Typography variant="body2" color="textSecondary">
              {video.User.username} • {video.views} views •{" "}
              {new Date(video.createdAt).toDateString()}{" "}
            </Typography>
          ) : (
            <Typography variant="body2" color="textSecondary">
              {video.views} views • {new Date(video.createdAt).toDateString()}{" "}
            </Typography>
          )}
          <Typography
            style={{ marginTop: "0.5rem" }}
            variant="body2"
            color="textSecondary"
          >
            {video.description.slice(0, 65)}
          </Typography>
        </div>
      </div>
    </Link>
  );
};

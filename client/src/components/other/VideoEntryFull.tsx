import React from "react";
import { Video } from "../../interfaces/Video";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

type Props = {
  video: Video;
};

// VideoEntryFull is the way video information is displayed on some pages, where one
// video takes up all of the width i.e. search page, history, trending
export const VideoEntryFull: React.FC<Props> = ({ video }) => {
  return (
    <Link to={`/watch/${video.id}`} style={{ textDecoration: "none" }}>
      <Grid container style={{ marginTop: "0.75rem" }} key={video.id}>
        <Grid item xs={2}>
          <img
            style={{ width: "12rem", marginRight: "1rem" }}
            alt="video-thumbnail"
            src={`http://localhost:3001/thumbnails/${video.id}.${video.thumbnail}`}
          />
        </Grid>
        <Grid item xs={10}>
          <Typography variant="h5" color="textPrimary">
            {video.title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {video.description}
          </Typography>
        </Grid>
      </Grid>
    </Link>
  );
};
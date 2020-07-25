import React from "react";
import { Video } from "../../interfaces/Video";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    height: theme.spacing(4),
    width: theme.spacing(4)
  }
}));

type Props = {
  video: Video;
};

export const VideoEntrySmall: React.FC<Props> = ({ video }) => {
  const classes = useStyles();
  return (
    <Link to={`/watch/${video.id}`} style={{ textDecoration: "none" }}>
      <div style={{ width: "15rem" }}>
        <img
          alt="video-thumnail"
          src={`http://localhost:3001/thumbnails/${video.id}.${video.thumbnail}`}
          style={{ width: "15rem" }}
        />
        <div style={{ display: "flex" }}>
          {video.User ? (
            <Avatar
              className={classes.avatar}
              src={`http://localhost:3001/avatars/${video.User.avatar}`}
              style={{ marginTop: "0.3rem" }}
            />
          ) : (
            <Avatar
              className={classes.avatar}
              style={{ marginTop: "0.3rem" }}
            />
          )}
          <div style={{ marginLeft: "0.2rem" }}>
            <Typography color="textSecondary" style={{ fontSize: "1rem" }}>
              <strong>{video.title}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {video.views} views • {new Date(video.createdAt).toDateString()}
            </Typography>
          </div>
        </div>
      </div>
    </Link>
  );
};

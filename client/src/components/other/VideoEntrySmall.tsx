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
    <Link
      to={`/watch/${video.id}`}
      style={{
        textDecoration: "none",
        marginRight: "1rem",
        marginBottom: "1rem"
      }}
    >
      <div style={{ width: "15rem", height: "8.5rem" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundSize: "100% 100%",
            backgroundImage: `url(http://localhost:3001/thumbnails/${video.id}.${video.thumbnail})`
          }}
        ></div>
        <div style={{ display: "flex", marginTop: "0.5rem" }}>
          {video.User && video.User.avatar !== null ? (
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
            <Typography
              color="textPrimary"
              style={{ fontSize: "0.90rem", lineHeight: "1rem" }}
            >
              {video.title}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ fontSize: "0.8rem" }}
            >
              {video.views} views • {new Date(video.createdAt).toDateString()}
            </Typography>
          </div>
        </div>
      </div>
    </Link>
  );
};

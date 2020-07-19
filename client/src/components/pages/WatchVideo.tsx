import React, { useState, useEffect, useCallback, MouseEvent } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { Video } from "../../interfaces/Video";
import { getSingleVideo } from "../../services/video";
import { Comment } from "../../interfaces/Comment";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { User } from "../../interfaces/User";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import { subscribeToUser } from "../../services/user";

const useStyles = makeStyles((theme: Theme) => ({
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500]
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500]
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6)
  }
}));

type Props = {
  id: string;
  user: User | null;
};

interface WatchPage {
  comments: Comment[];
  video: Video;
  user: User;
}

const WatchVideo: React.FC<Props> = ({ id, user }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [video, setVideo] = useState<WatchPage | null>(null);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const loadVideo = useCallback(async () => {
    const data = await getSingleVideo(id);
    setVideo(data);
  }, [id]);

  useEffect(() => {
    if (!loaded && video === null) {
      loadVideo();
      setLoaded(true);
    }
  }, [loaded, video, loadVideo]);

  const open = Boolean(anchorEl);

  const handleSubscribe = async () => {
    if (user !== null && video !== null) {
      await subscribeToUser(video.user.username);
    }
  };

  return (
    <Container>
      {video !== null && (
        <div style={{ marginTop: "2rem" }}>
          <video style={{ width: "100%" }} controls>
            <source
              src={`http://localhost:3001/video/${video.video.id}.${video.video.fileExtension}`}
              type="video/webm"
            />
          </video>
          <Typography variant="h5">{video.video.title}</Typography>
          <div style={{ display: "flex", marginTop: "0.75rem" }}>
            <Typography
              variant="body2"
              style={{ marginRight: "0.25rem" }}
              color="textSecondary"
            >
              {video.video.views} views
            </Typography>
            •
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginLeft: "0.25rem" }}
            >
              {new Date(video.video.createdAt).toDateString()}
            </Typography>
          </div>
          <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <div
            style={{
              display: "flex",
              marginBottom: "1rem",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex" }}>
              <Link to={`/channel/${video.user.id}`}>
                <Avatar
                  className={classes.avatar}
                  src={`http://localhost:3001/avatars/${video.user.id}${video.user.avatar}`}
                ></Avatar>
              </Link>
              <Link
                to={`/channel/${video.user.id}`}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  style={{ marginLeft: "0.5rem" }}
                  color="textPrimary"
                >
                  <strong>{video.user.username}</strong>
                </Typography>
                <Typography
                  style={{ marginLeft: "0.5rem" }}
                  color="textSecondary"
                  variant="body2"
                >
                  {video.user.subscribers} subscribers
                </Typography>
              </Link>
            </div>
            {user === null ? (
              <div>
                <Button variant="contained" onClick={handleClick}>
                  Subscribe
                </Button>
                <Popover
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                  }}
                >
                  <div style={{ padding: "1rem" }}>
                    You need to be logged in to subscribe.
                    <Divider
                      style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                    />
                    <Button variant="outlined">Login</Button>
                  </div>
                </Popover>
              </div>
            ) : (
              <Button variant="contained" onClick={handleSubscribe}>
                Subscribe
              </Button>
            )}
          </div>
          <Container maxWidth="lg">
            <Typography
              variant="body1"
              color="textPrimary"
              style={{ fontSize: "0.9rem" }}
            >
              {video.video.description}
            </Typography>
          </Container>
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos,
  user: state.user
});

export default connect(mapStateToProps)(WatchVideo);

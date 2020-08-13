import React, { useState, MouseEvent } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { User } from "../../../interfaces/User";
import { Video } from "../../../interfaces/Video";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import AddVideoToPlaylistWidget from "../../other/AddVideoToPlaylistWidget";
import Popover from "@material-ui/core/Popover";
import Modal from "@material-ui/core/Modal";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: "absolute",
    width: 300,
    backgroundColor: "rgba(33, 33, 33, 0.98)",
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 3)
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  progress: {
    colorPrimary: "#909090"
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6)
  }
}));

type Props = {
  subscribed: boolean | null;
  user: User | null;
  video: Video;
  handleSubscribe: () => Promise<void>;
  handleUnsubscribe: () => Promise<void>;
};

const VideoInformation: React.FC<Props> = ({
  user,
  subscribed,
  video,
  handleUnsubscribe,
  handleSubscribe
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openPlaylist, setOpenPlaylist] = useState<boolean>(false);
  const classes = useStyles();

  const closeModal = () => {
    setOpenPlaylist(false);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography variant="h6">{video.title}</Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", marginTop: "0.75rem" }}>
            <Typography
              variant="body2"
              style={{ marginRight: "0.25rem" }}
              color="textSecondary"
            >
              {video.views} views
            </Typography>
            •
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginLeft: "0.25rem" }}
            >
              {new Date(video.createdAt).toDateString()}
            </Typography>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div>
            <div style={{ display: "flex" }}>
              <Button
                style={{
                  backgroundColor: "transparent",
                  color: "#909090",
                  fontSize: "0.9rem"
                }}
                startIcon={<ThumbUpIcon />}
              >
                {video.likes}
              </Button>
              <Button
                style={{
                  backgroundColor: "transparent",
                  color: "#909090",
                  fontSize: "0.9rem"
                }}
                startIcon={<ThumbDownIcon />}
              >
                {video.dislikes}
              </Button>
            </div>
            <LinearProgress
              variant="determinate"
              className={classes.progress}
              value={
                video.likes - video.dislikes > 0
                  ? 0
                  : video.likes - video.dislikes
              }
            />
          </div>
          <Button
            startIcon={<PlaylistAddIcon />}
            style={{ background: "transparent", color: "#909090" }}
            onClick={() => setOpenPlaylist(true)}
          >
            Save
          </Button>
          <Modal
            open={openPlaylist}
            onClose={() => setOpenPlaylist(false)}
            className={classes.modal}
          >
            <div className={classes.paper}>
              <AddVideoToPlaylistWidget
                videoId={video.id}
                closeModal={closeModal}
              />
            </div>
          </Modal>
        </div>
      </div>
      <Divider style={{ marginBottom: "1rem" }} />
      {video.User !== undefined && (
        <div
          style={{
            display: "flex",
            marginBottom: "1rem",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex" }}>
            <Link to={`/channel/${video.User.id}`}>
              <Avatar
                className={classes.avatar}
                src={`http://localhost:3001/avatars/${video.User.avatar}`}
              ></Avatar>
            </Link>
            <div>
              <Link
                to={`/channel/${video.User.id}`}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  style={{ marginLeft: "0.5rem" }}
                  color="textPrimary"
                >
                  <strong>{video.User.username}</strong>
                </Typography>
                <Typography
                  style={{ marginLeft: "0.5rem" }}
                  color="textSecondary"
                  variant="body2"
                >
                  {video.User.subscribers} subscribers
                </Typography>
              </Link>
              <Typography
                variant="body1"
                color="textPrimary"
                style={{
                  fontSize: "0.9rem",
                  marginLeft: "0.5rem",
                  marginTop: "1rem"
                }}
              >
                {video.description}
              </Typography>
            </div>
          </div>
          {user === null ? (
            <div>
              <button className="button button-red" onClick={handleClick}>
                Subscribe
              </button>
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
                    style={{
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem"
                    }}
                  />
                  <Button variant="outlined">Login</Button>
                </div>
              </Popover>
            </div>
          ) : (
            <div>
              {subscribed ? (
                <button
                  className="button button-gray"
                  onClick={handleUnsubscribe}
                >
                  Subscribed
                </button>
              ) : (
                <button className="button button-red" onClick={handleSubscribe}>
                  Subscribe
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(VideoInformation);

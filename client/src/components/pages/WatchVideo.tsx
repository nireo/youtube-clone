import React, {
  useState,
  useEffect,
  useCallback,
  MouseEvent,
  ChangeEvent
} from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { Video } from "../../interfaces/Video";
import {
  getSingleVideo,
  likeVideoService,
  dislikeVideoService
} from "../../services/video";
import { Comment, RateComment } from "../../interfaces/Comment";
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
import TextField from "@material-ui/core/TextField";
import { createComment, rateComment } from "../../services/comment";
import { Helmet } from "react-helmet";
import Grid from "@material-ui/core/Grid";
import { SmallListVideo } from "../other/SmallListVideo";
import {
  subscribeToUserAction,
  removeSubscriptionAction
} from "../../store/subscriptionReducer";
import { CommentEntry } from "../other/CommentEntry";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import AddVideoToPlaylistWidget from "../other/AddVideoToPlaylistWidget";
import Modal from "@material-ui/core/Modal";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import LinearProgress from "@material-ui/core/LinearProgress";
import { PlaylistVideoEntry } from "../other/VideoPlaylistEntry";

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
  },
  commentAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  },
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
  }
}));

type Props = {
  id: string;
  user: User | null;
  subscriptions: User[];
  subscribeToUserAction: (userId: string) => void;
  removeSubscriptionAction: (userId: string) => void;
  playlistMode?: boolean;
  playlistVideos?: Video[];
};

interface WatchPage {
  comments: Comment[];
  video: Video;
  next: Video[];
  likeStatus: number;
}

const WatchVideo: React.FC<Props> = ({
  id,
  user,
  subscriptions,
  subscribeToUserAction,
  removeSubscriptionAction,
  playlistMode,
  playlistVideos
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [video, setVideo] = useState<WatchPage | null>(null);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const [openPlaylist, setOpenPlaylist] = useState<boolean>(false);

  // 0=no like, 1=liked, 2=disliked
  const [likeStatus, setLikeStatus] = useState<number>(0);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeModal = () => {
    setOpenPlaylist(false);
  };

  const loadVideo = useCallback(async () => {
    const data = await getSingleVideo(id);
    setVideo(data);
    setComments(data.comments);
    setLikeStatus(data.likeStatus);
  }, [id]);

  useEffect(() => {
    if (!loaded && video === null) {
      loadVideo();
      setLoaded(true);
    }

    if (subscribed === null && user && video && subscriptions.length) {
      const found = subscriptions.find(
        (subscription: User) => subscription.id === video.video.userId
      );

      if (found) {
        setSubscribed(true);
      } else {
        setSubscribed(false);
      }
    }
  }, [loaded, video, loadVideo, user, subscribed, subscriptions]);

  const open = Boolean(anchorEl);

  const handleSubscribe = async () => {
    if (user !== null && video !== null && video.video.User !== undefined) {
      subscribeToUserAction(video.video.User.id);
      setSubscribed(true);
    }
  };

  const handleUnsubscribe = async () => {
    if (user !== null && video !== null && video.video.User !== undefined) {
      removeSubscriptionAction(video.video.User.id);
      setSubscribed(false);
    }
  };

  const handleCommentInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "") {
      setEditing(true);
    }

    setComment(event.target.value);
  };

  const cancelCommentEdit = () => {
    setComment("");
    setEditing(false);
  };

  const handleCommentCreation = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user && video === null) {
      return;
    }

    let content = await createComment(id, { content: comment });
    let copy = video;
    // typescript for some reason requires a check that copy is not null
    if (copy === null) {
      return;
    }

    copy.comments = [...copy.comments, content];

    setVideo(copy);
  };

  const handleCommentRate = async (action: RateComment, commentId: string) => {
    if (comments === null) {
      return;
    }

    // check if the comment exists here, so that we can save calling the back-end if it doesn't
    let ratedComment = comments.find((c: Comment) => c.id === commentId);
    if (!ratedComment) {
      return;
    }

    await rateComment(action, commentId);
    if (action === "like") {
      ratedComment.likes++;
    } else if (action === "dislike") {
      ratedComment.dislikes++;
    }

    // update comments array
    const updatedComments = comments.map((c: Comment) =>
      c.id === commentId && ratedComment !== undefined ? ratedComment : c
    );
    if (!updatedComments) {
      return;
    }

    setComments(updatedComments);
  };

  const handleVideoLike = async () => {
    if (video === null) return;
    await likeVideoService(id);
    let copy: WatchPage = video;
    copy.video.likes++;

    setVideo(copy);
  };

  const handleVideoDislike = async () => {
    if (video === null) return;
    await dislikeVideoService(id);
    let copy: WatchPage = video;
    copy.video.dislikes--;

    setVideo(copy);
  };

  return (
    <Container maxWidth="xl">
      {video !== null && comments !== null && (
        <div style={{ marginTop: "2rem" }}>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{video.video.title} - TypeTube</title>
          </Helmet>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={9} md={9}>
              <video style={{ width: "100%" }} controls>
                <source
                  src={`http://localhost:3001/video/${video.video.id}.${video.video.fileExtension}`}
                  type="video/webm"
                />
              </video>
              <Typography variant="h6">{video.video.title}</Typography>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
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
                        {video.video.likes}
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "transparent",
                          color: "#909090",
                          fontSize: "0.9rem"
                        }}
                        startIcon={<ThumbDownIcon />}
                      >
                        {video.video.dislikes}
                      </Button>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      className={classes.progress}
                      value={
                        video.video.likes - video.video.dislikes > 0
                          ? 0
                          : video.video.likes - video.video.dislikes
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
                        videoId={id}
                        closeModal={closeModal}
                      />
                    </div>
                  </Modal>
                </div>
              </div>
              <Divider style={{ marginBottom: "1rem" }} />
              {video.video.User !== undefined && (
                <div
                  style={{
                    display: "flex",
                    marginBottom: "1rem",
                    justifyContent: "space-between"
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <Link to={`/channel/${video.video.User.id}`}>
                      <Avatar
                        className={classes.avatar}
                        src={`http://localhost:3001/avatars/${video.video.User.avatar}`}
                      ></Avatar>
                    </Link>
                    <div>
                      <Link
                        to={`/channel/${video.video.User.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography
                          style={{ marginLeft: "0.5rem" }}
                          color="textPrimary"
                        >
                          <strong>{video.video.User.username}</strong>
                        </Typography>
                        <Typography
                          style={{ marginLeft: "0.5rem" }}
                          color="textSecondary"
                          variant="body2"
                        >
                          {video.video.User.subscribers} subscribers
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
                        {video.video.description}
                      </Typography>
                    </div>
                  </div>
                  {user === null ? (
                    <div>
                      <button
                        className="button button-red"
                        onClick={handleClick}
                      >
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
                        <button
                          className="button button-red"
                          onClick={handleSubscribe}
                        >
                          Subscribe
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Grid>
            <Grid item sm={12} lg={3} md={3}>
              {playlistMode && playlistVideos ? (
                <div>
                  {playlistVideos.map((video: Video) => (
                    <PlaylistVideoEntry video={video} key={video.id} />
                  ))}
                </div>
              ) : (
                <div>
                  {video.next.map((video: Video) => (
                    <SmallListVideo key={video.id} video={video} />
                  ))}
                </div>
              )}
            </Grid>
          </Grid>
          <Grid container>
            <Grid sm={12} lg={9} md={9}>
              <div style={{ marginTop: "2rem" }}>
                <Divider />
                <Typography variant="h6" style={{ marginTop: "1rem" }}>
                  {video.comments.length} comments
                </Typography>
                {user !== null ? (
                  <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
                    <div style={{ display: "flex" }}>
                      <Avatar
                        src={`http://localhost:3001/avatars/${user.avatar}`}
                        className={classes.commentAvatar}
                        style={{ marginRight: "1rem" }}
                      />
                      <TextField
                        placeholder="Add public comment"
                        value={comment}
                        onChange={handleCommentInputChange}
                        fullWidth
                      />
                    </div>
                    {editing && (
                      <div style={{ float: "right", display: "flex" }}>
                        <Button onClick={cancelCommentEdit}>Cancel</Button>
                        <form onSubmit={handleCommentCreation}>
                          <Button variant="contained" type="submit">
                            Create comment
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", marginTop: "1rem" }}>
                    <Avatar
                      src=""
                      className={classes.commentAvatar}
                      style={{ marginRight: "1rem" }}
                    />
                    <TextField
                      placeholder="Add public comment"
                      fullWidth
                      disabled
                    />
                  </div>
                )}

                {comments.map((comment: Comment) => (
                  <CommentEntry
                    key={comment.id}
                    comment={comment}
                    handleCommentRate={handleCommentRate}
                  />
                ))}
              </div>
            </Grid>
          </Grid>
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos,
  user: state.user,
  subscriptions: state.subscriptions
});

export default connect(mapStateToProps, {
  removeSubscriptionAction,
  subscribeToUserAction
})(WatchVideo);

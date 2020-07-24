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
import { getSingleVideo } from "../../services/video";
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
import { subscribeToUser } from "../../services/user";
import TextField from "@material-ui/core/TextField";
import { createComment, rateComment } from "../../services/comment";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { Helmet } from "react-helmet";
import Grid from "@material-ui/core/Grid";
import { SmallListVideo } from "../other/SmallListVideo";

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
  users: User[];
}

const WatchVideo: React.FC<Props> = ({ id, user }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [video, setVideo] = useState<WatchPage | null>(null);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [testVideo] = useState({
    createdAt: "2020-07-17T21:11:07.197Z",
    description: "It really is kinda crazy",
    dislikes: 0,
    fileExtension: "webm",
    id: "dce9c774-3da9-4b3e-8aed-935e6099cbd7",
    likes: 0,
    thumbnail: "jpg",
    title: "You wil not believe how crazy this is!",
    updatedAt: "2020-07-24T10:15:27.678Z",
    userId: "bc5a913f-1177-4467-9687-22d55a30805a",
    views: 173
  });

  console.log(video);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const loadVideo = useCallback(async () => {
    const data = await getSingleVideo(id);
    setVideo(data);
    setComments(data.comments);
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

  return (
    <Container maxWidth="xl">
      {video !== null && comments !== null && (
        <div style={{ marginTop: "2rem" }}>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{video.video.title} - TypeTube</title>
          </Helmet>
          <Grid container spacing={2}>
            <Grid item xs={9}>
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
                        src={`http://localhost:3001/avatars/${video.user.id}${video.video.User.avatar}`}
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
                    <Button variant="contained" onClick={handleSubscribe}>
                      Subscribe
                    </Button>
                  )}
                </div>
              )}
              <Container maxWidth="lg">
                <Typography
                  variant="body1"
                  color="textPrimary"
                  style={{ fontSize: "0.9rem" }}
                >
                  {video.video.description}
                </Typography>
              </Container>
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

                {comments.map((comment: Comment, index: number) => (
                  <div style={{ marginTop: "0.75rem" }}>
                    <div style={{ display: "flex" }}>
                      <Avatar
                        src={`http://localhost:3001/avatars/${video.users[index].avatar}`}
                        className={classes.commentAvatar}
                        style={{ marginRight: "1rem" }}
                      />
                      <div>
                        <Typography>
                          <strong>{video.users[index].username}</strong>
                        </Typography>
                        <Typography>{comment.content}</Typography>
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <IconButton
                        onClick={() =>
                          handleCommentRate(RateComment.Like, comment.id)
                        }
                        style={{ backgroundColor: "transparent" }}
                      >
                        <ThumbUpIcon fontSize="small" />
                      </IconButton>
                      <Typography style={{ marginTop: "0.5rem" }}>
                        {comment.likes}
                      </Typography>
                      <IconButton
                        onClick={() =>
                          handleCommentRate(RateComment.Like, comment.id)
                        }
                        style={{ backgroundColor: "transparent" }}
                      >
                        <ThumbDownIcon fontSize="small" />
                      </IconButton>
                      <Typography style={{ marginTop: "0.5rem" }}>
                        {comment.dislikes}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" style={{ marginBottom: "0.75rem" }}>
                Up next
              </Typography>
              <SmallListVideo video={testVideo} />
            </Grid>
          </Grid>
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

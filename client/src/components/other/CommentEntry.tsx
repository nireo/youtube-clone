import React from "react";
import { Comment, RateComment } from "../../interfaces/Comment";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

type Props = {
  comment: Comment;
  handleCommentRate: (action: RateComment, commentId: string) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  commentAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  }
}));

export const CommentEntry: React.FC<Props> = ({
  comment,
  handleCommentRate
}) => {
  const classes = useStyles();
  if (!comment.User) {
    return null;
  }

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <div style={{ display: "flex" }}>
        <Avatar
          src={`http://localhost:3001/avatars/${comment.User.avatar}`}
          className={classes.commentAvatar}
          style={{ marginRight: "1rem" }}
        />
        <div>
          <Typography>
            {comment.User.username}
            <span
              style={{
                fontSize: "0.80rem",
                color: "#909090",
                marginLeft: "0.5rem"
              }}
            >
              {new Date(comment.createdAt).toDateString()}
            </span>
          </Typography>
          <Typography style={{ fontSize: "0.90rem" }}>
            {comment.content}
          </Typography>
          <div style={{ display: "flex" }}>
            <IconButton
              onClick={() => handleCommentRate(RateComment.Like, comment.id)}
              style={{
                backgroundColor: "transparent",
                paddingLeft: "0",
                paddingTop: "4px"
              }}
            >
              <ThumbUpIcon style={{ fontSize: "0.80rem", color: "#909090" }} />
            </IconButton>
            <Typography
              style={{
                fontSize: "0.80rem",
                color: "#909090"
              }}
            >
              {comment.likes}
            </Typography>
            <IconButton
              onClick={() => handleCommentRate(RateComment.Like, comment.id)}
              style={{ backgroundColor: "transparent", paddingTop: "4px" }}
            >
              <ThumbDownIcon
                style={{ fontSize: "0.80rem", color: "#909090" }}
              />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

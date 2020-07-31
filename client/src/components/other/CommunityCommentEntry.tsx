import React from "react";
import { CommunityComment } from "../../interfaces/Community";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

type Props = {
  comment: CommunityComment;
};

const useStyles = makeStyles((theme: Theme) => ({
  commentAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  }
}));

export const CommunityCommentEntry: React.FC<Props> = ({ comment }) => {
  const classes = useStyles();
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
        </div>
      </div>
    </div>
  );
};

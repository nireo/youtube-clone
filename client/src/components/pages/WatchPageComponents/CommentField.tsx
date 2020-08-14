import React, { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { Comment, RateComment } from "../../../interfaces/Comment";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { User } from "../../../interfaces/User";
import { CommentEntry } from "../../other/CommentEntry";

import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  commentAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  }
}));

type Props = {
  comments: Comment[];
  user: User | null;
  newComment: string;

  setNewComment: Dispatch<SetStateAction<string>>;
  handleCommentRate: (action: RateComment, commentId: string) => Promise<void>;
  handleCommentCreation: (event: ChangeEvent<HTMLFormElement>) => Promise<void>;
};

const CommentField: React.FC<Props> = ({
  comments,
  user,
  handleCommentCreation,
  handleCommentRate,
  newComment,
  setNewComment
}) => {
  const [comment, setComment] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);

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

  const classes = useStyles();
  return (
    <div style={{ marginTop: "2rem" }}>
      <Divider />
      <Typography variant="h6" style={{ marginTop: "1rem" }}>
        {comments.length} comments
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
              <button
                className="button button-gray"
                onClick={cancelCommentEdit}
              >
                Cancel
              </button>
              <form onSubmit={handleCommentCreation}>
                <button className="button button-gray" type="submit">
                  Create comment
                </button>
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
          <TextField placeholder="Add public comment" fullWidth disabled />
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
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(CommentField);

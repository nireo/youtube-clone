import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Community, CommunityComment } from "../../interfaces/Community";
import {
  getCommunityPostWithId,
  createCommunityComment
} from "../../services/community";
import { CommunityPost as CommunityPostEntry } from "../other/CommunityPost";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { CommunityCommentEntry } from "../other/CommunityCommentEntry";

const useStyles = makeStyles((theme: Theme) => ({
  commentAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  }
}));

type Props = {
  id: string;
  user: User | null;
};

const CommunityPost: React.FC<Props> = ({ id, user }) => {
  const [post, setPost] = useState<Community | null>(null);
  const [comments, setComments] = useState<CommunityComment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);
  const classes = useStyles();

  const loadPostData = useCallback(async () => {
    const data = await getCommunityPostWithId(id);
    setPost(data.post);
    setComments(data.comments);
  }, [id]);

  useEffect(() => {
    if (!loading && post === null) {
      setLoading(true);
      loadPostData();
      setLoading(false);
    }
  }, [loading, post, loadPostData]);

  const handleCommentInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditing(true);
    setComment(event.target.value);
  };

  const cancelCommentEdit = () => {
    setEditing(false);
    setComment("");
  };

  const handleCommentCreation = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newComment: CommunityComment = await createCommunityComment(
      id,
      comment
    );

    if (!comments) {
      setComments([newComment]);
    } else {
      setComments(comments.concat(newComment));
    }
  };

  return (
    <Container style={{ marginTop: "2rem" }} maxWidth="md">
      {post !== null && comments !== null && (
        <div>
          <CommunityPostEntry page post={post} />
          <Divider style={{ marginTop: "1rem" }} />
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
              <TextField placeholder="Add public comment" fullWidth disabled />
            </div>
          )}
          {comments.map((comment: CommunityComment) => (
            <CommunityCommentEntry comment={comment} key={comment.id} />
          ))}
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(CommunityPost);

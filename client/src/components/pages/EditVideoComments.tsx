import React, { useState, MouseEvent, Dispatch, SetStateAction } from "react";
import { Comment } from "../../interfaces/Comment";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { removeCommentFromVideo } from "../../services/comment";

type Props = {
  comments: Comment[];
  setComments: Dispatch<SetStateAction<Comment[] | null>>;
  videoId: string;
};

export const EditVideoComments: React.FC<Props> = ({
  comments,
  videoId,
  setComments
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCommentDeletion = async (commentId: string) => {
    await removeCommentFromVideo(videoId, commentId);
    setComments(
      comments.filter((comment: Comment) => comment.id !== commentId)
    );
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      {comments.map((comment: Comment) => (
        <div
          style={{
            width: "100%",
            paddingTop: "1rem",
            paddingBottom: "1rem",
            display: "flex",
            border: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.7)",
            padding: "1rem 1rem",
            justifyContent: "space-between"
          }}
          key={comment.id}
        >
          <div style={{ display: "flex" }}>
            <Avatar
              src={`http://localhost:3001/avatars/${comment.User.avatar}`}
            />
            <div style={{ marginLeft: "1rem" }}>
              <Typography variant="body2">
                <strong>{comment.User.username}</strong>
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {comment.content}
              </Typography>
            </div>
          </div>
          <IconButton
            aria-controls={`comment-${comment.id}-edit`}
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id={`comment-${comment.id}-edit`}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleCommentDeletion(comment.id)}>
              Delete
            </MenuItem>
          </Menu>
        </div>
      ))}
    </div>
  );
};

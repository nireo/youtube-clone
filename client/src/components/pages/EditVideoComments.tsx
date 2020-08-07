import React, { useState, MouseEvent } from "react";
import { Comment } from "../../interfaces/Comment";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

type Props = {
  comments: Comment[];
};

export const EditVideoComments: React.FC<Props> = ({ comments }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
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
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>Delete</MenuItem>
          </Menu>
        </div>
      ))}
    </div>
  );
};

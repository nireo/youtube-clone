import React from "react";
import { Community } from "../../interfaces/Community";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CommentIcon from "@material-ui/icons/Comment";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";

type Props = {
  post: Community;
};

export const CommunityPost: React.FC<Props> = ({ post }) => {
  return (
    <div
      style={{
        border: "1px solid",
        borderColor: "rgba(255, 255, 255, 0.7)",
        padding: "0.70rem 0.70rem",
        marginBottom: "1rem"
      }}
    >
      <div
        style={{
          display: "flex"
        }}
      >
        <Avatar
          style={{ marginRight: "1.25rem" }}
          src={`http://localhost:3001/avatars/${post.User.avatar}`}
        />
        <div>
          <Typography variant="body2" color="textPrimary">
            <strong>{post.User.username}</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {post.content}
          </Typography>
          <Link to={`/post/${post.id}`}>
            <IconButton style={{ marginTop: "0.5rem" }}>
              <CommentIcon style={{ fontSize: "0.80rem" }} />
            </IconButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

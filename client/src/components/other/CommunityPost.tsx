import React from "react";
import { Community } from "../../interfaces/Community";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

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
        display: "flex",
        marginBottom: "1rem"
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
      </div>
    </div>
  );
};

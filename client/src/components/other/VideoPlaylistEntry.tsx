import React from "react";
import { Video } from "../../interfaces/Video";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

type Props = {
  video: Video;
};

export const PlaylistVideoEntry: React.FC<Props> = ({ video }) => {
  return (
    <Link to={`/watch/${video.id}`} style={{ textDecoration: "none" }}>
      <ListItem button>
        <ListItemText
          style={{ color: "#fff" }}
          primary={video.title}
          secondary={`${video.User ? video.User.username : ""} • ${
            video.views
          } views • ${new Date(video.createdAt).toDateString()}`}
        />
      </ListItem>
    </Link>
  );
};

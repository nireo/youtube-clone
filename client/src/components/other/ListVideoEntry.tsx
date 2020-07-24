import React from "react";
import { Video } from "../../interfaces/Video";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

type Props = {
  video: Video;
};

// More compact version of the VideoEntryFull component. This one is used in playlists and
// probably some other places in the future
export const ListVideoEntry: React.FC<Props> = ({ video }) => {
  // to be used inside the @material-ui/core/List component
  return (
    <Link to={`/watch/${video.id}`} style={{ textDecoration: "none" }}>
      <ListItem button>
        <img
          alt="video-thumbnail"
          src={`http://localhost:3001/thumbnails/${video.id}.${video.thumbnail}`}
          style={{ width: "8rem", marginRight: "1rem" }}
        />
        <ListItemText
          style={{ color: "#fff" }}
          primary={video.title}
          secondary={`${video.views} views • ${new Date(
            video.createdAt
          ).toDateString()}`}
        />
      </ListItem>
    </Link>
  );
};

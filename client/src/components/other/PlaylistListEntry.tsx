import React from "react";
import { Playlist } from "../../interfaces/Playlist";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

type Props = {
  playlist: Playlist;
};

export const PlaylistListEntry: React.FC<Props> = ({ playlist }) => {
  return (
    <Link to={`/playlist/${playlist.id}`} style={{ textDecoration: "none" }}>
      <ListItem button>
        <ListItemText
          style={{ color: "#fff" }}
          primary={playlist.title}
          secondary={playlist.description}
        />
      </ListItem>
    </Link>
  );
};

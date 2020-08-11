import React, { Dispatch, SetStateAction } from "react";
import { Video } from "../../interfaces/Video";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

type Props = {
  video: Video;
  setSelectedVideo?: Dispatch<SetStateAction<Video | null>>;
  selectedVideoId?: string;
};

export const PlaylistVideoEntry: React.FC<Props> = ({
  video,
  setSelectedVideo,
  selectedVideoId
}) => {
  if (setSelectedVideo !== undefined) {
    return (
      <ListItem
        button
        className={`${
          selectedVideoId && selectedVideoId === video.id
            ? "selected-playlist-item"
            : ""
        } `}
        onClick={() => setSelectedVideo(video)}
      >
        <ListItemText
          style={{ color: "#fff" }}
          primary={video.title}
          secondary={`${video.User ? video.User.username : ""} • ${
            video.views
          } views • ${new Date(video.createdAt).toDateString()}`}
        />
      </ListItem>
    );
  }

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

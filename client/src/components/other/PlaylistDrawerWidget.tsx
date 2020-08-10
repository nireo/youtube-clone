import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Playlist } from "../../interfaces/Playlist";
import { initPlaylistsAction } from "../../store/playlistReducer";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import { Link } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

type Props = {
  user: User | null;
  playlists: Playlist[];
  initPlaylistsAction: (userId: string) => void;
};

const PlaylistDrawerWidget: React.FC<Props> = ({
  user,
  playlists,
  initPlaylistsAction
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(3);

  useEffect(() => {
    if (user !== null && !loaded && !(playlists.length > 0)) {
      initPlaylistsAction(user.id);
      setLoaded(true);
    }
  }, [user, loaded, playlists, initPlaylistsAction]);

  if (user === null) return null;

  return (
    <div>
      {loaded && (
        <div>
          <List dense>
            {playlists.slice(0, amount).map((playlist: Playlist) => (
              <Link
                to={`/playlist/${playlist.id}`}
                key={playlist.id}
                style={{ textDecoration: "none" }}
              >
                <ListItem button>
                  <ListItemIcon>
                    <PlaylistPlayIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={playlist.title}
                    style={{ color: "#fff" }}
                  />
                </ListItem>
              </Link>
            ))}
            {amount !== playlists.length && amount < playlists.length && (
              <ListItem button onClick={() => setAmount(playlists.length)}>
                <ListItemIcon>
                  <ExpandMoreIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`Show ${playlists.length - amount} more`}
                />
              </ListItem>
            )}
            {amount === playlists.length && amount < playlists.length && (
              <ListItem button onClick={() => setAmount(3)}>
                <ListItemIcon>
                  <ExpandLessIcon />
                </ListItemIcon>
                <ListItemText primary={`Show less`} />
              </ListItem>
            )}
          </List>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  playlists: state.playlists
});

export default connect(mapStateToProps, { initPlaylistsAction })(
  PlaylistDrawerWidget
);

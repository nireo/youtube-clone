import React, { useState, useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Playlist } from "../../interfaces/Playlist";
import { getUserPlaylists } from "../../services/playlist";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { addVideoToPlaylist as service_addVideoToPlaylist } from "../../services/playlist";

type Props = {
  user: User | null;
  videoId: string;
};

const AddVideoToPlaylistWidget: React.FC<Props> = ({ user, videoId }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const loadPlaylists = useCallback(async () => {
    if (user === null) {
      return;
    }

    const data = await getUserPlaylists(user.id);
    setPlaylists(data);
  }, [user]);

  useEffect(() => {
    if (!loaded) {
      loadPlaylists();
      setLoaded(true);
    }
  }, [loaded, playlists, loadPlaylists]);

  if (!user) {
    return null;
  }

  const addVideoToPlaylist = async (playlistId: string) => {
    await service_addVideoToPlaylist(playlistId, videoId);
  };

  return (
    <List style={{ width: "100%" }}>
      {playlists.map((playlist: Playlist) => (
        <ListItem button onClick={() => addVideoToPlaylist(playlist.id)}>
          <ListItemText primary={playlist.title} />
        </ListItem>
      ))}
    </List>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(AddVideoToPlaylistWidget);

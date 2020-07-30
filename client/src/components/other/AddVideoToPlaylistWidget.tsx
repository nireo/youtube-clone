import React, { useState, useCallback, useEffect, ChangeEvent } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Playlist } from "../../interfaces/Playlist";
import { getUserPlaylists, createPlaylist } from "../../services/playlist";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { addVideoToPlaylist as service_addVideoToPlaylist } from "../../services/playlist";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

type Props = {
  user: User | null;
  videoId: string;
};

const AddVideoToPlaylistWidget: React.FC<Props> = ({ user, videoId }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [creating, setCreating] = useState<boolean>(false);
  const [playlistName, setPlaylistName] = useState<string>("");

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

  const handlePlaylistCreation = async (
    event: ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newPlaylist = await createPlaylist({ title: playlistName });
    setPlaylists(playlists.concat(newPlaylist));
  };

  return (
    <div>
      <Typography>Save to...</Typography>
      <Divider />
      <List style={{ width: "100%" }}>
        {playlists.length === 0 ? (
          <Typography>No playlists</Typography>
        ) : (
          <div>
            {playlists.map((playlist: Playlist) => (
              <ListItem button onClick={() => addVideoToPlaylist(playlist.id)}>
                <ListItemText primary={playlist.title} />
              </ListItem>
            ))}
          </div>
        )}
      </List>
      <Divider />

      {!creating ? (
        <Button
          style={{ background: "transparent", marginTop: "0.5rem" }}
          startIcon={<AddIcon />}
          onClick={() => setCreating(true)}
        >
          Create new playlist
        </Button>
      ) : (
        <form style={{ marginTop: "0.5rem" }} onSubmit={handlePlaylistCreation}>
          <TextField
            value={playlistName}
            onChange={({ target }) => setPlaylistName(target.value)}
            placeholder="Playlist name"
            title="Playlist name"
            color="secondary"
            fullWidth
          />
          <Button
            style={{ background: "transparent" }}
            startIcon={<AddIcon />}
            type="submit"
          >
            Create new playlist
          </Button>
        </form>
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(AddVideoToPlaylistWidget);

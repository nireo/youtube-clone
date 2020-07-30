import React, { useState, useCallback, useEffect, ChangeEvent } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Playlist } from "../../interfaces/Playlist";
import { Video } from "../../interfaces/Video";
import { getPlaylistVideos, updatePlaylistInfo } from "../../services/playlist";
import Typography from "@material-ui/core/Typography";
import { VideoEntryFull } from "../other/VideoEntryFull";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { AppState } from "../../store";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import { User } from "../../interfaces/User";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

type Props = {
  playlistId: string;
  user: User | null;
};

interface PlaylistWithVideos {
  playlist: Playlist;
  videos: Video[];
}

const PlaylistVideos: React.FC<Props> = ({ playlistId, user }) => {
  const [playlist, setPlaylist] = useState<PlaylistWithVideos | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const loadPlaylist = useCallback(async () => {
    const data = await getPlaylistVideos(playlistId);
    setPlaylist(data);
    setTitle(data.playlist.title);

    if (data.playlist.description) setDescription(data.playlist.description);
  }, [playlistId]);

  useEffect(() => {
    if (!loading && playlist === null) {
      setLoading(true);
      loadPlaylist();
    }
  }, [loading, playlist, loadPlaylist]);

  const handlePlaylistUpdate = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updatePlaylistInfo(playlistId, { title, description });
  };

  return (
    <Container maxWidth="lg">
      {playlist !== null && (
        <Grid container spacing={3}>
          <Grid xs={4}>
            <Paper style={{ padding: "1.25rem 1.25rem" }}>
              {!editing ? (
                <div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Typography variant="h5" style={{ marginTop: "0.5rem" }}>
                      {playlist.playlist.title}
                    </Typography>
                    {user !== null && user.id === playlist.playlist.userId && (
                      <IconButton
                        style={{ marginLeft: "0.5rem" }}
                        onClick={() => setEditing(true)}
                      >
                        <CreateIcon />
                      </IconButton>
                    )}
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    {playlist.playlist.description}
                  </Typography>
                </div>
              ) : (
                <form onSubmit={handlePlaylistUpdate}>
                  <TextField
                    label="Title"
                    placeholder="Title"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                    fullWidth
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    placeholder="Description"
                    value={description}
                    onChange={({ target }) => setDescription(target.value)}
                    style={{ marginTop: "1rem" }}
                  />
                  <div style={{ marginTop: "1rem" }}>
                    <Button onClick={() => setEditing(false)}>Cancel</Button>
                    <Button
                      style={{ marginLeft: "1rem" }}
                      type="submit"
                      variant="contained"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              )}
            </Paper>
          </Grid>
          <Grid xs={8}>
            <div style={{ marginLeft: "1rem", width: "100%" }}>
              {playlist !== null && playlist.videos.length === 0 ? (
                <div>
                  <Typography variant="h6">No videos.</Typography>
                  <Typography variant="body2" color="textSecondary">
                    This playlist is currently empty
                  </Typography>
                </div>
              ) : (
                <div>
                  {playlist.videos.map((video: any) => (
                    <VideoEntryFull video={video[0]} key={video.id} />
                  ))}
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(PlaylistVideos);

import React, { useState, useEffect, useCallback } from "react";
import { Playlist } from "../../interfaces/Playlist";
import { getUserPlaylists } from "../../services/playlist";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { PlaylistListEntry } from "../other/PlaylistListEntry";

type Props = {
  id: string;
};

export const UserPlaylists: React.FC<Props> = ({ id }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const loadPlaylists = useCallback(async () => {
    const data = await getUserPlaylists(id);
    setPlaylists(data);
  }, [id]);

  useEffect(() => {
    if (!loaded) {
      loadPlaylists();
      setLoaded(true);
    }
  }, [loaded, playlists, loadPlaylists]);

  return (
    <Container>
      {!loaded && (
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <CircularProgress />
        </div>
      )}
      {loaded && playlists.length === 0 && (
        <div style={{ marginTop: "2rem" }}>
          <Typography variant="h6">404, Not found.</Typography>
          <Typography variant="body2" color="textSecondary">
            This user has not created any public playlists
          </Typography>
        </div>
      )}
      {loaded && playlists.length > 0 && (
        <div>
          {playlists.map((playlist: Playlist) => (
            <PlaylistListEntry playlist={playlist} />
          ))}
        </div>
      )}
    </Container>
  );
};

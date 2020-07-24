import React, { useState, useCallback, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Playlist } from "../../interfaces/Playlist";
import { Video } from "../../interfaces/Video";
import { getPlaylistVideos } from "../../services/playlist";
import Typography from "@material-ui/core/Typography";
import { VideoEntryFull } from "../other/VideoEntryFull";
import Paper from "@material-ui/core/Paper";

type Props = {
  playlistId: string;
};

interface PlaylistWithVideos {
  playlist: Playlist;
  videos: Video[];
}

export const PlaylistVideos: React.FC<Props> = ({ playlistId }) => {
  const [playlist, setPlaylist] = useState<PlaylistWithVideos | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPlaylist = useCallback(async () => {
    const data = await getPlaylistVideos(playlistId);
    setPlaylist(data);
  }, [playlistId]);

  useEffect(() => {
    if (!loading && playlist === null) {
      setLoading(true);
      loadPlaylist();
    }
  }, [loading, playlist, loadPlaylist]);

  return (
    <Container>
      {playlist !== null && (
        <Grid container spacing={3}>
          <Grid xs={4}>
            <Paper style={{ padding: "1.25rem 1.25rem" }}>
              <Typography variant="h5">{playlist.playlist.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {playlist.playlist.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={8}>
            <div style={{ marginLeft: "1rem" }}>
              {playlist.videos.length === 0 ? (
                <div>
                  <Typography variant="h6">No videos.</Typography>
                  <Typography variant="body2" color="textSecondary">
                    This playlist is currently empty
                  </Typography>
                </div>
              ) : (
                <div>
                  {playlist.videos.map((video: Video) => (
                    <VideoEntryFull video={video} />
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

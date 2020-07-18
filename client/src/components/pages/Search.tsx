import React, { useState, useEffect, useCallback } from "react";
import { Video } from "../../interfaces/Video";
import { videoSearch } from "../../services/video";
import { useLocation } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

export const Search: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const query = new URLSearchParams(useLocation().search);

  const loadVideosWithQuery = useCallback(async () => {
    const search = query.get("search");
    if (search === null) {
      return;
    }
    const data = await videoSearch(search);
    setVideos(data);
  }, [query]);

  useEffect(() => {
    if (!loaded) {
      loadVideosWithQuery();
      setLoaded(true);
    }
  }, [loaded, loadVideosWithQuery]);

  console.log(videos);

  return (
    <div style={{ marginTop: "2rem" }}>
      {loaded && videos.length === 0 && (
        <Container>
          <Typography variant="h5">404 Not found.</Typography>
        </Container>
      )}
      {loaded && videos.length > 0 && (
        <Container>
          <Typography variant="h6">
            For search: '{query.get("search")}', found {videos.length}{" "}
            {videos.length === 1 ? "result" : "results"}.
          </Typography>
          <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          {videos.map((video: Video) => (
            <Grid container style={{ marginTop: "0.75rem" }} key={video.id}>
              <Grid item xs={2}>
                <img
                  style={{ width: "12rem", marginRight: "1rem" }}
                  alt="video-thumbnail"
                  src={`http://localhost:3001/thumbnails/${video.id}.${video.thumbnail}`}
                />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="h5">{video.title}</Typography>
                <Typography variant="body1" color="textSecondary">
                  {video.description}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Container>
      )}
    </div>
  );
};

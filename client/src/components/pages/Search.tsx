import React, { useState, useEffect, useCallback } from "react";
import { Video } from "../../interfaces/Video";
import { videoSearch } from "../../services/video";
import { useLocation } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { VideoEntryFull } from "../other/VideoEntryFull";

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
            <VideoEntryFull video={video} />
          ))}
        </Container>
      )}
    </div>
  );
};

import React, { useState, useEffect, useCallback } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Video } from "../../interfaces/Video";
import { VideoEntrySmall } from "../other/VideoEntrySmall";
import { getVideos } from "../../services/video";

export const Home: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>([]);

  const loadVideos = useCallback(async () => {
    const data = await getVideos();
    setVideos(data);
  }, []);

  useEffect(() => {
    if (!loaded) {
      loadVideos();
      setLoaded(true);
    }
  }, [loaded, loadVideos]);

  return (
    <Container maxWidth="xl" style={{ marginTop: "1rem" }}>
      <Typography variant="h5">Recommended</Typography>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem" }}>
        {videos.map((video: Video) => (
          <VideoEntrySmall key={video.id} video={video} />
        ))}
      </div>
    </Container>
  );
};

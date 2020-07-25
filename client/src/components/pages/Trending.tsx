import React, { useState, useEffect, useCallback } from "react";
import { Video } from "../../interfaces/Video";
import { getTrendingVideos } from "../../services/video";
import { VideoEntryFull } from "../other/VideoEntryFull";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { Helmet } from "react-helmet";

export const Trending: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadTrendingVideos = useCallback(async () => {
    const data = await getTrendingVideos();
    setVideos(data);
  }, []);

  useEffect(() => {
    if (!loading && !(videos.length > 0)) {
      setLoading(true);
      loadTrendingVideos();
      setLoading(false);
    }
  }, [loading, videos, loadTrendingVideos]);

  return (
    <Container style={{ marginTop: "1rem" }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Trending - TypeTube</title>
      </Helmet>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {videos.map((video: Video) => (
            <VideoEntryFull key={video.id} video={video} />
          ))}
        </div>
      )}
    </Container>
  );
};

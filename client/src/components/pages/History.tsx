import React, { useState, useEffect, useCallback } from "react";
import { User } from "../../interfaces/User";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { Redirect } from "react-router-dom";
import { Video } from "../../interfaces/Video";
import { getHistoryList } from "../../services/user";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import { VideoEntryFull } from "../other/VideoEntryFull";

type Props = {
  user: User | null;
};

const History: React.FC<Props> = ({ user }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState<string>("");

  const loadVideos = useCallback(async () => {
    const data = await getHistoryList();
    setVideos(data);
  }, []);

  useEffect(() => {
    if (!loaded && videos.length === 0) {
      loadVideos();
      setLoaded(true);
    }
  }, [loaded, videos, loadVideos]);

  if (!user) {
    return <Redirect to="/" />;
  }

  const filteredVideos = videos.filter((video: Video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <Typography
        style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
        variant="h5"
      >
        History
      </Typography>
      <Divider />
      {loaded && videos.length === 0 && (
        <div>
          <Typography variant="h6">Your history is empty.</Typography>
          <Typography variant="body1" color="textSecondary">
            This page gets filled with all the videos you have watched.
          </Typography>
        </div>
      )}
      {!loaded && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <CircularProgress />
        </div>
      )}
      {loaded && videos.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {filteredVideos.map((video: Video) => (
            <VideoEntryFull video={video} />
          ))}
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(History);

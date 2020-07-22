import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { User } from "../../interfaces/User";
import { AppState } from "../../store";
import { Redirect } from "react-router-dom";
import { Video } from "../../interfaces/Video";
import { getWatchLaterList } from "../../services/user";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import { VideoEntryFull } from "../other/VideoEntryFull";

type Props = {
  user: User | null;
};

const WatchLater: React.FC<Props> = ({ user }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>([]);

  const loadWatchLaterList = useCallback(async () => {
    const data = await getWatchLaterList();
    setVideos(data);
  }, []);

  useEffect(() => {
    if (!loaded && videos.length === 0) {
      loadWatchLaterList();
      setLoaded(true);
    }
  }, [loaded, videos, loadWatchLaterList]);

  if (user === null) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <Typography
        style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
        variant="h5"
      >
        Watch Later
      </Typography>
      <Divider />
      {loaded && videos.length === 0 && (
        <div>
          <Typography variant="h6">Your watch later list is empty.</Typography>
          <Typography variant="body1" color="textSecondary">
            You can add videos to your watch later list in the watch video tab.
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
          {videos.map((video: Video) => (
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

export default connect(mapStateToProps)(WatchLater);

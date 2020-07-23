import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import Container from "@material-ui/core/Container";
import { User } from "../../interfaces/User";
import { Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Video } from "../../interfaces/Video";
import { VideoEntryFull } from "../other/VideoEntryFull";
import { getLibraryData } from "../../services/user";

type Props = {
  user: User | null;
};

const Library: React.FC<Props> = ({ user }) => {
  const [historyVideos, setHistoryVideos] = useState<Video[]>([]);
  const [watchLaterVideos, setWatchLaterVideos] = useState<Video[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const loadLibraryData = useCallback(async () => {
    const data = await getLibraryData();
    setHistoryVideos(data.history);
    setWatchLaterVideos(data.watchLater);
  }, []);

  useEffect(() => {
    if (!loaded && user !== null) {
      loadLibraryData();
      setLoaded(true);
    }
  }, [loaded, user, loadLibraryData]);

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <Typography variant="h5" style={{ marginTop: "2rem" }}>
        History
      </Typography>
      {historyVideos.map((video: Video) => (
        <VideoEntryFull key={`history-${video.id}`} video={video} />
      ))}
      <Typography variant="h5" style={{ marginTop: "2rem" }}>
        Watch later
      </Typography>
      {watchLaterVideos.map((video: Video) => (
        <VideoEntryFull key={`watchLater-${video.id}`} video={video} />
      ))}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(Library);

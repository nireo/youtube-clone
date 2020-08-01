import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import Container from "@material-ui/core/Container";
import { User } from "../../interfaces/User";
import { Redirect } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Video } from "../../interfaces/Video";
import { getLibraryData } from "../../services/user";
import { Helmet } from "react-helmet";
import { VideoEntrySmall } from "../other/VideoEntrySmall";
import Divider from "@material-ui/core/Divider";

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
      <Helmet>
        <title>Library - TypeTube</title>
        <meta charSet="utf-8" />
      </Helmet>
      <Typography variant="h5" style={{ marginTop: "2rem" }}>
        History
      </Typography>
      <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
      {historyVideos.length === 0 ? (
        <div>
          <Typography style={{ marginTop: "1rem" }} variant="h6">
            No history.
          </Typography>
          <Typography>
            You're history site will be filled with more data, when you watch
            videos.
          </Typography>
        </div>
      ) : (
        <div>
          {historyVideos.map((video: Video) => (
            <VideoEntrySmall key={`history-${video.id}`} video={video} />
          ))}
        </div>
      )}
      <Typography variant="h5" style={{ marginTop: "2rem" }}>
        Watch later
      </Typography>
      <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
      {watchLaterVideos.length === 0 ? (
        <div>
          <Typography variant="h6">No watch later videos.</Typography>
          <Typography>
            You don't have any videos in the watch later list.
          </Typography>
        </div>
      ) : (
        <div>
          {watchLaterVideos.map((video: Video) => (
            <VideoEntrySmall key={`watchLater-${video.id}`} video={video} />
          ))}
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(Library);

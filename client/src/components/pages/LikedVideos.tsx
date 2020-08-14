import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Redirect } from "react-router-dom";
import { getLikedVideos } from "../../services/user";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Video } from "../../interfaces/Video";
import Divider from "@material-ui/core/Divider";
import { VideoEntryFull } from "../other/VideoEntryFull";

type Props = {
  user: User | null;
};

const LikedVideos: React.FC<Props> = ({ user }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>([]);

  const loadLikedVideos = useCallback(async () => {
    const data = await getLikedVideos();
    setVideos(data);
  }, []);

  useEffect(() => {
    if (!loaded && videos.length === 0 && user) {
      loadLikedVideos();
      setLoaded(true);
    }
  }, [loaded, videos, user, loadLikedVideos]);

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <Typography
        style={{ marginTop: "2rem", fontSize: "1.1rem", marginBottom: "1rem" }}
      >
        <strong>Liked videos</strong>
      </Typography>
      {loaded && videos.length > 0 && (
        <div>
          {videos.map((video: Video) => (
            <VideoEntryFull video={video} key={video.id} />
          ))}
        </div>
      )}
      {loaded && videos.length === 0 && (
        <div>
          <Typography style={{ fontSize: "0.9" }}>404, Not found.</Typography>
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(LikedVideos);

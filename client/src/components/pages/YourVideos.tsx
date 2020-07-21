import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Redirect } from "react-router-dom";
import { Video } from "../../interfaces/Video";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircuralProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { VideoEntryFull } from "../other/VideoEntryFull";
import { getUserVideos } from "../../services/video";

type Props = {
  user: User | null;
};

const YourVideos: React.FC<Props> = ({ user }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[] | null>(null);

  const loadUserData = useCallback(async () => {
    if (user === null) {
      return;
    }

    const data = await getUserVideos();
    setVideos(data);
  }, [user]);

  useEffect(() => {
    if (!loaded && videos === null && user) {
      loadUserData();
      setLoaded(true);
    }
  }, [loaded, videos, user, loadUserData]);

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <Typography variant="h5" style={{ marginTop: "1rem" }}>
        Your videos
      </Typography>
      <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
      {loaded === false && videos === null && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <CircuralProgress />
        </div>
      )}
      {loaded === true && videos !== null && videos.length === 0 && (
        <div style={{ marginTop: "2rem" }}>
          <Typography variant="h6">404, Not found</Typography>
          <Typography variant="body1">
            You haven't uploaded a video yet, you can do this at the{" "}
            <Link to="/upload">upload</Link> page
          </Typography>
        </div>
      )}
      {loaded === true && videos !== null && videos.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
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

export default connect(mapStateToProps)(YourVideos);

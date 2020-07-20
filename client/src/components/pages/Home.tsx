import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { getVideosAction } from "../../store/videoReducer";
import { VideoEntryFull } from "../other/VideoEntryFull";
import { Video } from "../../interfaces/Video";

type Props = {
  getVideosAction: () => void;
  videos: Video[];
};

const Home: React.FC<Props> = ({ getVideosAction, videos }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (!loaded && videos === []) {
      getVideosAction();
      setLoaded(true);
    }
  }, [loaded, getVideosAction, videos]);

  return (
    <Container maxWidth="lg" style={{ marginTop: "1rem" }}>
      <Typography variant="h5">Home</Typography>
      <div style={{ display: "flex" }}>
        {videos.map((video: Video) => (
          <VideoEntryFull video={video} />
        ))}
      </div>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos
});

export default connect(mapStateToProps, { getVideosAction })(Home);

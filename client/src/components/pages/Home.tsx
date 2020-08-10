import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { getVideosAction } from "../../store/videoReducer";
import { Video } from "../../interfaces/Video";
import { VideoEntrySmall } from "../other/VideoEntrySmall";

type Props = {
  getVideosAction: () => void;
  videos: Video[];
};

const Home: React.FC<Props> = ({ getVideosAction, videos }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (!loaded) {
      getVideosAction();
      setLoaded(true);
    }
  }, [loaded, getVideosAction, videos]);

  return (
    <Container maxWidth="xl" style={{ marginTop: "1rem" }}>
      <Typography variant="h5">Recommended</Typography>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem" }}>
        {videos.map((video: Video) => (
          <VideoEntrySmall key={video.id} video={video} />
        ))}
      </div>
      <button style={{ marginTop: "5rem" }} className="button button-red">
        Subscribe
      </button>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos
});

export default connect(mapStateToProps, { getVideosAction })(Home);

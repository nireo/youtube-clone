import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { Video } from "../../interfaces/Video";
import { getSingleVideo } from "../../services/video";
import { Comment } from "../../interfaces/Comment";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

type Props = {
  id: string;
};

interface WatchPage {
  comments: Comment[];
  video: Video;
}

const WatchVideo: React.FC<Props> = ({ id }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [video, setVideo] = useState<WatchPage | null>(null);

  const loadVideo = useCallback(async () => {
    const data = await getSingleVideo(id);
    setVideo(data);
  }, [id]);

  useEffect(() => {
    if (!loaded && video === null) {
      loadVideo();
      setLoaded(true);
    }
  }, [loaded, video, loadVideo]);

  console.log(video);

  return (
    <Container>
      {video !== null && (
        <div style={{ marginTop: "2rem" }}>
          <video style={{ width: "100%" }} controls>
            <source
              src={`http://localhost:3001/video/${video.video.id}.${video.video.fileExtension}`}
              type="video/webm"
            />
          </video>
          <Typography variant="h5">{video.video.title}</Typography>
          <div style={{ display: "flex", marginTop: "0.75rem" }}>
            <Typography
              variant="body2"
              style={{ marginRight: "0.25rem" }}
              color="textSecondary"
            >
              {video.video.views} views
            </Typography>
            •
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginLeft: "0.25rem" }}
            >
              {new Date(video.video.createdAt).toDateString()}
            </Typography>
          </div>
          <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Typography
            variant="body1"
            color="textPrimary"
            style={{ fontSize: "0.9rem" }}
          >
            {video.video.description}
          </Typography>
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  videos: state.videos
});

export default connect(mapStateToProps)(WatchVideo);

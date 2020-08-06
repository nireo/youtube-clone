import React, { useState, useCallback, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Video } from "../../interfaces/Video";
import { getEditData } from "../../services/video";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Comment } from "../../interfaces/Comment";

type Props = {
  user: User | null;
  videoId: string;
};

const EditVideo: React.FC<Props> = ({ user, videoId }) => {
  const [video, setVideo] = useState<null | Video>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadVideo = useCallback(async () => {
    const data = await getEditData(videoId);
    if (data.video) {
      setVideo(data);
    }

    if (data.comments) {
      setComments(data.comments);
    }
  }, [videoId]);

  useEffect(() => {
    if (!loading && user !== null && video === null) {
      setLoading(true);
      loadVideo();
      setLoading(false);
    }
  }, [loading, loadVideo, user, video]);

  if (!user) return null;

  return (
    <Container style={{ marginTop: "2rem" }}>
      {loading ? (
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {!video ? (
            <div>
              <Typography variant="h5">404, Not found.</Typography>
              <Typography color="textSecondary">
                The video you're looking for has not been found.
              </Typography>
            </div>
          ) : (
            <div>
              <Typography variant="h5">{video.title}</Typography>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(EditVideo);

import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { deleteVideo } from "../../services/video";

type Props = {
  videoId: string;
};

export const VideoManage: React.FC<Props> = ({ videoId }) => {
  const history = useHistory();
  const handleVideoDeletion = async () => {
    await deleteVideo(videoId);
    history.push("/your-videos");
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <Typography variant="h6">Delete video</Typography>
      <Typography variant="body2" color="textSecondary">
        This action irreversible, and you cannot get any data related to your
        video back.
      </Typography>
      <Button
        variant="contained"
        onClick={handleVideoDeletion}
        color="secondary"
      >
        Delete
      </Button>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { deleteVideo, updateVideoPrivacyLevel } from "../../services/video";
import { Video } from "../../interfaces/Video";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

type Props = {
  videoId: string;
  video: Video;
};

export const VideoManage: React.FC<Props> = ({ videoId, video }) => {
  const history = useHistory();
  const [privacyLevel, setPrivacyLevel] = useState<number | null>(null);
  const handleVideoDeletion = async () => {
    await deleteVideo(videoId);
    history.push("/your-videos");
  };

  useEffect(() => {
    if (privacyLevel === null) {
      setPrivacyLevel(video.privacyLevel);
    }
  }, [privacyLevel, video.privacyLevel]);

  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    if (privacyLevel === null) return;
    const newPrivacyLevel = event.target.value as number;
    updateVideoPrivacyLevel(newPrivacyLevel, videoId);
    setPrivacyLevel(newPrivacyLevel);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <div>
        <Typography variant="h6">Delete video</Typography>
        <Typography variant="body2" color="textSecondary">
          This action irreversible, and you cannot get any data related to your
          video back.
        </Typography>
        <Button
          variant="contained"
          onClick={handleVideoDeletion}
          color="secondary"
          style={{ marginTop: "0.5rem" }}
        >
          Delete
        </Button>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <Typography variant="h6">Change privacy</Typography>
        {privacyLevel !== null && (
          <FormControl
            variant="outlined"
            style={{ marginTop: "0.5rem", width: "100%" }}
          >
            <InputLabel id="privacy-level-select" color="secondary">
              Privacy
            </InputLabel>
            <Select
              labelId="privacy-level-select"
              id="privacy-level-select-outlined"
              value={privacyLevel}
              onChange={handleChange}
              label="Privacy"
              color="secondary"
            >
              <MenuItem value={0}>Public</MenuItem>
              <MenuItem value={1}>Only with link</MenuItem>
              <MenuItem value={2}>Private</MenuItem>
            </Select>
          </FormControl>
        )}
      </div>
    </div>
  );
};

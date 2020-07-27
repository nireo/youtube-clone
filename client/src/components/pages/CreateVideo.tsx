import React, { useState, ChangeEvent } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import axios from "axios";
import UploadIcon from "@material-ui/icons/CloudUpload";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import ImageIcon from "@material-ui/icons/Image";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Redirect } from "react-router-dom";

type Props = {
  user: User | null;
};

const CreateVideo: React.FC<Props> = ({ user }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // files
  const [video, setVideo] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);

  if (!user) {
    return <Redirect to="/" />;
  }

  const handleVideoChange = (event: any) => {
    if (event.target.files[0] !== null) {
      setVideo(event.target.files[0]);
    }
  };

  const handleThumbnailChange = (event: any) => {
    if (event.target.files[0] !== null) {
      setThumbnail(event.target.files[0]);
    }
  };

  const uploadVideo = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    await axios.post("/videos", formData, config);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h6">Upload video</Typography>
      <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
      <form onSubmit={uploadVideo}>
        <TextField
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          style={{ width: "100%", marginBottom: "1.5rem" }}
          placeholder="Title"
          variant="filled"
          color="secondary"
          title="Title"
        />
        <TextField
          value={description}
          style={{ width: "100%", marginBottom: "1.5rem" }}
          onChange={({ target }) => setDescription(target.value)}
          placeholder="Description"
          variant="filled"
          color="secondary"
          rows={4}
          multiline
          title="Description"
        />
        <div>
          <input
            placeholder="Video file"
            id="video-upload"
            type="file"
            style={{ width: "100%", marginBottom: "1.5rem", display: "none" }}
            onChange={handleVideoChange}
            accept="video/*"
          />
          <label htmlFor="video-upload">
            <Button
              variant="contained"
              component="span"
              color="secondary"
              startIcon={<VideoCallIcon />}
              style={{ marginRight: "1rem" }}
            >
              Video
            </Button>
          </label>
          <input
            placeholder="Thumbnail file"
            type="file"
            id="thumbnail-upload"
            style={{ display: "none" }}
            onChange={handleThumbnailChange}
            accept="image/*"
          />
          <label htmlFor="thumbnail-upload">
            <Button
              variant="contained"
              component="span"
              color="secondary"
              startIcon={<ImageIcon />}
            >
              Thumbnail
            </Button>
          </label>
        </div>
        <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<UploadIcon />}
        >
          Upload
        </Button>
      </form>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(CreateVideo);

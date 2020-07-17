import React, { useState, ChangeEvent } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import axios from "axios";

export const CreateVideo: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // files
  const [video, setVideo] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);

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
      <Typography variant="h6">Upload Video</Typography>
      <Divider style={{ marginTop: "2rem", marginBottom: "2rem" }} />
      <form onSubmit={uploadVideo}>
        <TextField
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          style={{ width: "100%", marginBottom: "1.5rem" }}
          placeholder="Title"
        />
        <TextField
          value={description}
          style={{ width: "100%", marginBottom: "1.5rem" }}
          onChange={({ target }) => setDescription(target.value)}
          placeholder="Description"
        />
        <Typography>Video file</Typography>
        <div>
          <input
            placeholder="Video file"
            type="file"
            style={{ width: "100%", marginBottom: "1.5rem" }}
            onChange={handleVideoChange}
          />
          <input
            placeholder="Thumbnail file"
            type="file"
            style={{ marginBottom: "1.5rem" }}
            onChange={handleThumbnailChange}
          />
        </div>
        <Button variant="contained">Upload</Button>
      </form>
    </Container>
  );
};

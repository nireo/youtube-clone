import React, { useState, useCallback, useEffect, ChangeEvent } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Video, UpdateVideo } from "../../interfaces/Video";
import {
  getEditData,
  updateVideo,
  updateVideoThumbnail
} from "../../services/video";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Comment } from "../../interfaces/Comment";
import TextField from "@material-ui/core/TextField";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ImageIcon from "@material-ui/icons/Image";
import { EditVideoComments } from "./EditVideoComments";
import { VideoManage } from "./VideoManage";

type Props = {
  user: User | null;
  videoId: string;
};

const EditVideo: React.FC<Props> = ({ user, videoId }) => {
  const [video, setVideo] = useState<null | Video>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);

  const loadVideo = useCallback(async () => {
    const data = await getEditData(videoId);
    if (data.video) {
      setVideo(data.video);

      setTitle(data.video.title);
      setDescription(data.video.description);
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

  const handlePageChange = (event: ChangeEvent<{}>, newPage: number) => {
    setPage(newPage);
  };

  const handleThumbnailChange = (event: any) => {
    if (event.target.files[0] !== null) {
      setThumbnail(event.target.files[0]);

      let reader: any = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const updateVideoInformation = async (
    event: ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const data: UpdateVideo = {
      title,
      description
    };

    await updateVideo(videoId, data);
  };

  const handleThumbnailUpdate = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);

    await updateVideoThumbnail(videoId, formData);
  };

  return (
    <div>
      <div style={{ backgroundColor: "#282828" }}>
        <Container>
          <div style={{ flexGrow: 1 }}>
            <Tabs
              value={page}
              onChange={handlePageChange}
              indicatorColor="secondary"
              textColor="secondary"
              centered
            >
              <Tab label="Video" />
              <Tab label="Comments" />
              <Tab label="Manage" />
            </Tabs>
          </div>
        </Container>
      </div>
      <Container>
        {loading && (
          <div style={{ marginTop: "4rem", textAlign: "center" }}>
            <CircularProgress />
          </div>
        )}
        {!loading && (
          <div>
            {page === 0 && (
              <div>
                {video !== null && (
                  <div style={{ marginTop: "1rem" }}>
                    <Grid container spacing={3}>
                      <Grid item md={6} lg={6} sm={12}>
                        <Typography variant="h5">Basic information</Typography>
                        <Divider />
                        {!editing ? (
                          <div>
                            <Typography variant="h6">{video.title}</Typography>
                            <Typography color="textSecondary" variant="body2">
                              {video.description}
                            </Typography>
                            <Button
                              style={{ marginTop: "1rem" }}
                              variant="contained"
                              color="secondary"
                              onClick={() => setEditing(true)}
                            >
                              Update Info
                            </Button>
                          </div>
                        ) : (
                          <form
                            onSubmit={updateVideoInformation}
                            style={{ marginTop: "1rem" }}
                          >
                            <TextField
                              value={title}
                              onChange={({ target }) => setTitle(target.value)}
                              placeholder="Title"
                              label="Title"
                              fullWidth
                              color="secondary"
                              variant="outlined"
                            />
                            <TextField
                              value={description}
                              onChange={({ target }) =>
                                setDescription(target.value)
                              }
                              multiline
                              variant="outlined"
                              fullWidth
                              rows={4}
                              label="Description"
                              placeholder="Description"
                              style={{ marginTop: "1rem" }}
                              color="secondary"
                            />
                            <div style={{ marginTop: "1rem" }}>
                              <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                              >
                                Update info
                              </Button>
                              <Button
                                style={{ marginLeft: "0.5rem" }}
                                onClick={() => setEditing(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        )}
                      </Grid>
                      <Grid item md={6} lg={6} sm={12}>
                        <Typography variant="h5">Files</Typography>
                        <Divider />
                        <div
                          style={{
                            width: "15rem",
                            height: "8rem",
                            marginTop: "1rem"
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundSize: "100% 100%",
                              backgroundImage: `url(http://localhost:3001/thumbnails/${video.id}.${video.thumbnail})`
                            }}
                          ></div>
                        </div>
                        <form
                          onSubmit={handleThumbnailUpdate}
                          style={{ marginTop: "1rem" }}
                        >
                          <input
                            placeholder="Thumbnail file"
                            type="file"
                            id="thumbnail-upload"
                            style={{ display: "none" }}
                            onChange={handleThumbnailChange}
                            accept="image/*"
                          />
                          {thumbnail === null ? (
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
                          ) : (
                            <Button
                              variant="contained"
                              color="secondary"
                              type="submit"
                            >
                              Update thumbnail
                            </Button>
                          )}
                        </form>
                        {thumbnailPreview !== "" && (
                          <div style={{ marginTop: "2rem" }}>
                            <Typography variant="body2" color="textSecondary">
                              Thumbnail preview
                            </Typography>
                            <div
                              style={{
                                width: "15rem",
                                height: "8rem",
                                marginTop: "1rem"
                              }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  backgroundSize: "100% 100%",
                                  backgroundImage: `url(${thumbnailPreview})`
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  </div>
                )}
              </div>
            )}
            {page === 1 && (
              <div>
                {!comments ? (
                  <div>
                    <Typography variant="h6">Video has no comments</Typography>
                  </div>
                ) : (
                  <div>
                    <EditVideoComments
                      comments={comments}
                      videoId={videoId}
                      setComments={setComments}
                    />
                  </div>
                )}
              </div>
            )}
            {page === 2 && <VideoManage videoId={videoId} />}
          </div>
        )}
      </Container>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(EditVideo);

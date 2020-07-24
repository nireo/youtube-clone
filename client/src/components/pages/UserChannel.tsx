import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { getChannelData, updateUser } from "../../services/user";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Video } from "../../interfaces/Video";
import { VideoEntryFull } from "../other/VideoEntryFull";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Helmet } from "react-helmet";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { UserPlaylists } from "./UserPlaylists";

const useStyles = makeStyles((theme: Theme) => ({
  channelAvatar: {
    width: theme.spacing(16),
    height: theme.spacing(16)
  }
}));

type Props = {
  id: string;
  user: User | null;
};

const UserChannel: React.FC<Props> = ({ id, user }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [channelUser, setChannelUser] = useState<User | null>(null);
  const [channelVideos, setChannelVideos] = useState<Video[] | null>(null);
  const [page, setPage] = useState<number>(0);
  const [editing, setEditing] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>("");
  const classes = useStyles();

  const loadChannelData = useCallback(async () => {
    const data = await getChannelData(id);
    setChannelUser(data.user);
    setChannelVideos(data.videos);
  }, [id]);

  const stopEditing = () => {
    setEditing(false);
  };

  const startEditing = () => {
    setEditing(true);
  };

  useEffect(() => {
    if (loaded === false && channelUser === null) {
      loadChannelData();
      setLoaded(true);
    }
  }, [loaded, channelUser, loadChannelData]);

  const handlePageChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setPage(newValue);
  };

  const handleChannelUpdate = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateUser({ description: newDescription });
  };

  return (
    <Container>
      {channelUser !== undefined &&
        channelUser !== null &&
        channelVideos !== null && (
          <div style={{ marginTop: "3rem" }}>
            <Helmet>
              <meta charSet="utf-8" />
              <title>{channelUser.username} - TypeTube</title>
            </Helmet>
            <div style={{ display: "flex" }}>
              <Avatar
                src={`http://localhost:3001/avatars/${channelUser.avatar}`}
                className={classes.channelAvatar}
              />
              <div>
                <Typography
                  style={{ marginLeft: "1rem", fontSize: "2rem" }}
                  color="textPrimary"
                >
                  {channelUser.username}
                </Typography>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  style={{ marginLeft: "1rem" }}
                >
                  {channelUser.subscribers} subscribers
                </Typography>
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <Tabs
                value={page}
                onChange={handlePageChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Videos" />
                <Tab label="Playlists" />
                <Tab label="About" />
              </Tabs>
            </div>
            <Divider style={{ marginBottom: "1.5rem" }} />
            {page === 0 && (
              <div>
                {channelVideos.map((video: Video) => (
                  <VideoEntryFull video={video} />
                ))}
              </div>
            )}
            {page === 1 && <UserPlaylists id={id} />}
            {page === 2 && (
              <div>
                <Typography variant="body1">
                  {channelUser.description}
                </Typography>
                {user !== null && user.id === id && (
                  <div>
                    {editing === false ? (
                      <IconButton onClick={startEditing}>
                        <CreateIcon />
                      </IconButton>
                    ) : (
                      <form onSubmit={handleChannelUpdate}>
                        <TextField
                          value={newDescription}
                          onChange={({ target }) =>
                            setNewDescription(target.value)
                          }
                          variant="filled"
                          rows={3}
                          multiline
                          fullWidth
                        />
                        <div style={{ float: "right", marginTop: "0.5rem" }}>
                          <Button onClick={stopEditing}>Cancel</Button>
                          <Button
                            style={{ marginLeft: "0.5rem" }}
                            variant="contained"
                          >
                            Update
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
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

export default connect(mapStateToProps)(UserChannel);

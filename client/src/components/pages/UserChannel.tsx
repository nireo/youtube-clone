import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { getChannelData } from "../../services/user";
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

const UserChannel: React.FC<Props> = ({ id }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [channelUser, setChannelUser] = useState<User | null>(null);
  const [channelVideos, setChannelVideos] = useState<Video[] | null>(null);
  const [page, setPage] = useState<number>(0);
  const classes = useStyles();

  const loadChannelData = useCallback(async () => {
    const data = await getChannelData(id);
    setChannelUser(data.user);
    setChannelVideos(data.videos);
  }, [id]);

  useEffect(() => {
    if (loaded === false && channelUser === null) {
      loadChannelData();
      setLoaded(true);
    }
  }, [loaded, channelUser, loadChannelData]);

  const handlePageChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setPage(newValue);
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
            {page === 2 && (
              <div>
                <Typography variant="body1">
                  {channelUser.description}
                </Typography>
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

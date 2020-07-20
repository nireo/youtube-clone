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

  return (
    <Container>
      {channelUser !== undefined &&
        channelUser !== null &&
        channelVideos !== null && (
          <div style={{ marginTop: "3rem" }}>
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
            <Divider style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }} />
            <Typography variant="h6">Videos</Typography>
            {channelVideos.map((video: Video) => (
              <VideoEntryFull video={video} />
            ))}
          </div>
        )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(UserChannel);

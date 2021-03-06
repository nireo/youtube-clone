import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
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
import Button from "@material-ui/core/Button";
import { UserPlaylists } from "./UserPlaylists";
import {
  removeSubscriptionAction,
  subscribeToUserAction
} from "../../store/subscriptionReducer";
import Modal from "@material-ui/core/Modal";
import { UserSubscriptions } from "./UserSubscriptions";
import UserCommunity from "./UserCommunity";
import ChannelUpdateModal from "../other/ChannelUpdateModal";

const useStyles = makeStyles((theme: Theme) => ({
  channelAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  paper: {
    position: "absolute",
    width: 600,
    backgroundColor: "#282828",
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

type Props = {
  id: string;
  user: User | null;
  subscriptions: User[];
  removeSubscriptionAction: (userId: string) => void;
  subscribeToUserAction: (userId: string) => void;
};

const UserChannel: React.FC<Props> = ({
  id,
  user,
  subscriptions,
  removeSubscriptionAction,
  subscribeToUserAction
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [channelUser, setChannelUser] = useState<User | null>(null);
  const [channelVideos, setChannelVideos] = useState<Video[] | null>(null);
  const [page, setPage] = useState<number>(0);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const classes = useStyles();

  const loadChannelData = useCallback(async () => {
    const data = await getChannelData(id);
    setChannelUser(data.user);
    setChannelVideos(data.videos);
  }, [id]);

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (loaded === false && channelUser === null) {
      loadChannelData();
      setLoaded(true);
    }

    if (subscribed === null && user && channelUser && subscriptions.length) {
      const found = subscriptions.find(
        (subscription: User) => subscription.id === channelUser.id
      );

      if (found) {
        setSubscribed(true);
      } else {
        setSubscribed(false);
      }
    }
  }, [loaded, channelUser, loadChannelData, subscribed, subscriptions, user]);

  const handlePageChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setPage(newValue);
  };

  const handleUnsubscribe = () => {
    if (user !== null && channelUser !== null) {
      removeSubscriptionAction(channelUser.id);
      setSubscribed(false);
    }
  };

  const handleSubscription = () => {
    if (user !== null && channelUser !== null) {
      subscribeToUserAction(channelUser.id);
    }
  };

  return (
    <div>
      {channelUser !== undefined &&
        channelUser !== null &&
        channelVideos !== null && (
          <div>
            <Helmet>
              <meta charSet="utf-8" />
              <title>{channelUser.username} - TypeTube</title>
            </Helmet>
            <Modal open={open} onClose={closeModal} className={classes.modal}>
              <div className={classes.paper}>
                <ChannelUpdateModal />
              </div>
            </Modal>
            {channelUser !== null && channelUser.banner !== null ? (
              <div
                style={{
                  width: "100%",
                  height: "27vh",
                  backgroundImage: `url(http://localhost:3001/banners/${channelUser.banner})`,
                  backgroundSize: "100% 100%"
                }}
              ></div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "27vh",
                  backgroundColor: "#ff1744"
                }}
              ></div>
            )}
            <div
              style={{
                backgroundColor: "#282828"
              }}
            >
              <Container
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "1rem",
                  paddingBottom: "1rem"
                }}
              >
                <div style={{ display: "flex" }}>
                  <Avatar
                    src={`http://localhost:3001/avatars/${channelUser.avatar}`}
                    className={classes.channelAvatar}
                  />
                  <div>
                    <Typography
                      style={{ marginLeft: "1rem" }}
                      variant="h6"
                      color="textPrimary"
                    >
                      {channelUser.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ marginLeft: "1rem" }}
                    >
                      {channelUser.subscribers} subscribers
                    </Typography>
                  </div>
                </div>
                {user !== null && user.id === channelUser.id ? (
                  <div style={{ marginTop: "2rem" }}>
                    <button
                      className="button button-blue"
                      onClick={() => setOpen(true)}
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <div style={{ marginTop: "2rem" }}>
                    {subscribed ? (
                      <button
                        onClick={handleUnsubscribe}
                        className="button button-gray"
                      >
                        Subscribed
                      </button>
                    ) : (
                      <button
                        onClick={handleSubscription}
                        className="button button-red"
                      ></button>
                    )}
                  </div>
                )}
              </Container>
              <Container>
                <div style={{ flexGrow: 1 }}>
                  <Tabs
                    value={page}
                    onChange={handlePageChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                  >
                    <Tab label="Videos" />
                    <Tab label="Playlists" />
                    <Tab label="Subscriptions" />
                    <Tab label="Community" />
                    <Tab label="About" />
                  </Tabs>
                </div>
              </Container>
            </div>
            <Divider style={{ marginBottom: "1.5rem" }} />
            <Container>
              {page === 0 && (
                <div>
                  {channelVideos.map((video: Video) => (
                    <VideoEntryFull video={video} key={video.id} />
                  ))}
                </div>
              )}
              {page === 1 && <UserPlaylists id={id} />}
              {page === 2 && <UserSubscriptions id={id} />}
              {page === 3 && <UserCommunity id={id} />}
              {page === 4 && (
                <div>
                  <Typography variant="body1">
                    {channelUser.description}
                  </Typography>
                </div>
              )}
            </Container>
          </div>
        )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  subscriptions: state.subscriptions
});

export default connect(mapStateToProps, {
  subscribeToUserAction,
  removeSubscriptionAction
})(UserChannel);

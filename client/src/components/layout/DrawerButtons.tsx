import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import HistoryIcon from "@material-ui/icons/History";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import PlaylistDrawerWidget from "../other/PlaylistDrawerWidget";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

export const DrawerButtons: React.FC = () => {
  return (
    <div>
      <Divider />
      <List>
        <Link to="/" style={{ textDecoration: "none" }}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary="Home" />
          </ListItem>
        </Link>
        <Link to="/trending" style={{ textDecoration: "none" }}>
          <ListItem button>
            <ListItemIcon>
              <WhatshotIcon />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary="Trending" />
          </ListItem>
        </Link>
        <Link to="/subscriptions" style={{ textDecoration: "none" }}>
          <ListItem button>
            <ListItemIcon>
              <SubscriptionsIcon />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary="Subscriptions" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <Link to="/library" style={{ textDecoration: "none" }}>
          <ListItem button>
            <ListItemIcon>
              <VideoLibraryIcon />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary="Library" />
          </ListItem>
        </Link>
        <Link to="/history" style={{ textDecoration: "none" }}>
          <ListItem button>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary="History" />
          </ListItem>
        </Link>
        <Link to="/your-videos" style={{ textDecoration: "none" }}>
          <ListItem button>
            <ListItemIcon>
              <OndemandVideoIcon />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary="Your videos" />
          </ListItem>
        </Link>
        <Link to="/liked" style={{ textDecoration: "none" }}>
          <ListItem button>
            <ListItemIcon>
              <ThumbUpIcon />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary="Liked" />
          </ListItem>
        </Link>
        <Link to="/watch-later" style={{ textDecoration: "none" }}>
          <ListItem button>
            <ListItemIcon>
              <WatchLaterIcon />
            </ListItemIcon>
            <ListItemText style={{ color: "#fff" }} primary="Watch Later" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <PlaylistDrawerWidget />
      <Divider />
    </div>
  );
};

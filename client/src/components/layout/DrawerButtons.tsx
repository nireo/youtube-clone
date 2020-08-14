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

interface ListItemInterface {
  link: string;
  iconComponent: any;
  text: string;
}

const items: ListItemInterface[] = [
  {
    link: "/",
    iconComponent: <HomeIcon />,
    text: "Home"
  },

  {
    link: "/trending",
    iconComponent: <WhatshotIcon />,
    text: "Trending"
  },
  {
    link: "/subscriptions",
    iconComponent: <SubscriptionsIcon />,
    text: "Subscriptions"
  },
  {
    link: "/library",
    iconComponent: <VideoLibraryIcon />,
    text: "Library"
  },
  {
    link: "/history",
    iconComponent: <HistoryIcon />,
    text: "History"
  },
  {
    link: "/your-videos",
    iconComponent: <OndemandVideoIcon />,
    text: "Your videos"
  },
  {
    link: "/liked",
    iconComponent: <ThumbUpIcon />,
    text: "Liked videos"
  },
  {
    link: "/watch-later",
    iconComponent: <WatchLaterIcon />,
    text: "Watch later"
  }
];

export const DrawerButtons: React.FC = () => {
  return (
    <div>
      <Divider />
      <List>
        {items.map((item: ListItemInterface) => (
          <Link to={item.link} style={{ textDecoration: "none" }}>
            <ListItem button>
              <ListItemIcon>{item.iconComponent}</ListItemIcon>
              <ListItemText style={{ color: "#fff" }} primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <PlaylistDrawerWidget />
      <Divider />
    </div>
  );
};

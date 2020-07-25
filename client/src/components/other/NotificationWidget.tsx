import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import { AppState } from "../../store";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { Notification } from "../../interfaces/Notification";
import { User } from "../../interfaces/User";

type Props = {
  notifications: Notification[];
  user: User | null;
};

const NotificationWidget: React.FC<Props> = ({ notifications, user }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!loaded && !(notifications.length > 0)) {
    }
  }, []);

  if (!user) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <div>
      <IconButton onClick={handleClick}>
        <NotificationsIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <List>
          <ListItem button>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText primary="Someone commented on your video" />
          </ListItem>
        </List>
      </Popover>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  notifications: state.notifications,
  user: state.user
});

export default connect(mapStateToProps)(NotificationWidget);

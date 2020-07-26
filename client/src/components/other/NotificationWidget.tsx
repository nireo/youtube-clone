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
import { initNotificationsAction } from "../../store/notificationReducer";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

type Props = {
  notifications: Notification[];
  user: User | null;
  initNotificationsAction: () => void;
};

const NotificationWidget: React.FC<Props> = ({
  notifications,
  user,
  initNotificationsAction
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!loaded && !(notifications.length > 0)) {
      initNotificationsAction();
      setLoaded(true);
    }

    if (count === null && notifications.length > 0) {
      let tempCount = 0;
      notifications.forEach((notification: Notification) => {
        if (notification.read === false) {
          tempCount++;
        }
      });

      setCount(tempCount);
    }
  }, [loaded, initNotificationsAction, notifications, count]);

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
        {count !== null ? (
          <Badge badgeContent={count} color="primary">
            <NotificationsIcon />
          </Badge>
        ) : (
          <NotificationsIcon />
        )}
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
        {notifications.length > 0 ? (
          <List>
            {notifications.map((notification: Notification) => (
              <ListItem button key={notification.id}>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText primary={notification.content} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No notifications found.</Typography>
        )}
      </Popover>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  notifications: state.notifications,
  user: state.user
});

export default connect(mapStateToProps, { initNotificationsAction })(
  NotificationWidget
);

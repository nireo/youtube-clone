import React from "react";
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

const NotificationWidget: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

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
  notifications: state.notifications
});

export default connect(mapStateToProps)(NotificationWidget);

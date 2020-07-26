import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { initSubscriptionsAction } from "../../store/subscriptionReducer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    height: theme.spacing(4),
    width: theme.spacing(4)
  }
}));

type Props = {
  user: User | null;
  subscriptions: User[];
  initSubscriptionsAction: () => void;
};

const SubscriptionsWidget: React.FC<Props> = ({
  user,
  subscriptions,
  initSubscriptionsAction
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(7);
  const classes = useStyles();

  useEffect(() => {
    if (user !== null && !loaded && !(subscriptions.length > 0)) {
      initSubscriptionsAction();
      setLoaded(true);
    }
  }, [user, loaded, subscriptions, initSubscriptionsAction]);

  if (user === null) {
    return null;
  }

  return (
    <div>
      {loaded && (
        <div>
          <List dense={true}>
            {subscriptions.slice(0, amount).map((subscription: User) => (
              <Link
                to={`/channel/${subscription.id}`}
                style={{ textDecoration: "none" }}
                key={subscription.id}
              >
                <ListItem button>
                  {subscription.avatar !== null ? (
                    <ListItemAvatar>
                      <Avatar
                        src={`http://localhost:3001/avatars/${subscription.avatar}`}
                        className={classes.avatar}
                      />
                    </ListItemAvatar>
                  ) : (
                    <ListItemAvatar>
                      <Avatar className={classes.avatar} />
                    </ListItemAvatar>
                  )}
                  <ListItemText
                    style={{ color: "#fff" }}
                    primary={subscription.username}
                  />
                </ListItem>
              </Link>
            ))}
            {amount !== subscriptions.length && amount < subscriptions.length && (
              <ListItem button onClick={() => setAmount(subscriptions.length)}>
                <ListItemIcon>
                  <ExpandMoreIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`Show ${subscriptions.length - amount} more`}
                />
              </ListItem>
            )}
            {amount === subscriptions.length && amount < subscriptions.length && (
              <ListItem button onClick={() => setAmount(7)}>
                <ListItemIcon>
                  <ExpandLessIcon />
                </ListItemIcon>
                <ListItemText primary={`Show less`} />
              </ListItem>
            )}
          </List>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  subscriptions: state.subscriptions
});

export default connect(mapStateToProps, { initSubscriptionsAction })(
  SubscriptionsWidget
);

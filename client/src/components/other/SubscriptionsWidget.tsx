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

type Props = {
  user: User | null;
  subscriptions: User[];
  initSubscriptionsAction: () => void;
};

const SubscriptionsWidget: React.FC<Props> = ({ user, subscriptions }) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (user !== null && !loaded && !(subscriptions.length > 0)) {
      initSubscriptionsAction();
      setLoaded(true);
    }
  }, [user, loaded, subscriptions]);

  if (user === null) {
    return null;
  }

  return (
    <div>
      {loaded && (
        <div>
          <List>
            {subscriptions.map((subscription: User) => (
              <ListItem button key={subscription.id}>
                {subscription.avatar !== null ? (
                  <ListItemAvatar>
                    <Avatar
                      src={`http://localhost:3001/avatars/${subscription.avatar}`}
                    />
                  </ListItemAvatar>
                ) : (
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                )}
                <Avatar />
                <ListItemText primary={subscription.username} />
              </ListItem>
            ))}
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

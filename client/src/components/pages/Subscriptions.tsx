import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Redirect } from "react-router-dom";
import { getSubscriptions } from "../../services/user";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, Theme } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(16),
    height: theme.spacing(16)
  }
}));

type Props = {
  user: User | null;
};

const Subscriptions: React.FC<Props> = ({ user }) => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const classes = useStyles();

  const loadSubscriptions = useCallback(async () => {
    const data = await getSubscriptions();
    setUsers(data);
  }, []);

  useEffect(() => {
    if (users === null && loaded === false && user !== null) {
      loadSubscriptions();
      setLoaded(true);
    }
  }, [loadSubscriptions, loaded, users, user]);

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <Container style={{ marginTop: "1rem" }}>
      <Typography variant="h5">Your subscriptions</Typography>
      <Divider style={{ marginTop: "1rem", marginBottom: "2rem" }} />
      {users !== null && (
        <div>
          {users.map((u: User) => (
            <Link
              to={`/channel/${u.id}`}
              style={{ paddingBottom: "1rem", textDecoration: "none" }}
              key={u.id}
            >
              <div style={{ display: "flex" }}>
                {u.avatar !== null ? (
                  <Avatar
                    src={`http://localhost:3001/avatars/${u.avatar}`}
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar className={classes.avatar} />
                )}
                <div>
                  <Typography
                    style={{ marginLeft: "1rem", fontSize: "2rem" }}
                    color="textPrimary"
                  >
                    {u.username}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    style={{ marginLeft: "1rem" }}
                  >
                    {u.subscribers} subscribers
                  </Typography>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(Subscriptions);

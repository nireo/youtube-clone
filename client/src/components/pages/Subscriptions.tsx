import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Redirect } from "react-router-dom";
import { getSubscriptions } from "../../services/user";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

type Props = {
  user: User | null;
};

const Subscriptions: React.FC<Props> = ({ user }) => {
  const [users, setUsers] = useState<User[] | null>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const loadSubscriptions = useCallback(async () => {
    const data = await getSubscriptions();
    setUsers(data);
  }, []);

  useEffect(() => {
    if (!users && !loaded) {
      loadSubscriptions();
      setLoaded(true);
    }
  }, [loadSubscriptions, loaded, users]);

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <Typography variant="h5">Your subscriptions</Typography>
      <Divider style={{ marginTop: "1rem", marginBottom: "2rem" }} />
      {users !== null && (
        <div>
          {users.map((u: User) => (
            <div>{u.username}</div>
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

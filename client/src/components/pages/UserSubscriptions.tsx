import React, { useState, useEffect, useCallback } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { User } from "../../interfaces/User";
import { getUserSubscriptions } from "../../services/user";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(14),
    height: theme.spacing(14)
  }
}));

type Props = {
  id: string;
};

export const UserSubscriptions: React.FC<Props> = ({ id }) => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const classes = useStyles();

  const loadUserSubscriptions = useCallback(async () => {
    const data = await getUserSubscriptions(id);
    setUsers(data);
  }, [id]);

  useEffect(() => {
    if (users === null && !loading) {
      setLoading(true);
      loadUserSubscriptions();
      setLoading(false);
    }
  }, [users, loading, loadUserSubscriptions]);

  return (
    <Container>
      {loading ? (
        <div style={{ marginTop: "2rem" }}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          {users !== null && users.length === 0 && (
            <div>
              <Typography variant="h6">404, Not found.</Typography>
              <Typography>
                This user either has no subscriptions or they are private.
              </Typography>
            </div>
          )}
          {users !== null && users.length > 0 && (
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
                        style={{ marginLeft: "1rem" }}
                        color="textPrimary"
                        variant="h6"
                      >
                        {u.username}
                      </Typography>
                      <Typography
                        variant="body1"
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
        </div>
      )}
    </Container>
  );
};

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { User } from "../../interfaces/User";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    width: "100%",
    background: "#181818",
    border: "1px solid #181818",
    marginRottom: "1rem",
    padding: "0.6rem 1rem",
    borderRadius: "3px",
    color: "rgba(255, 255, 255, 0.88)"
  }
}));

type Props = {
  user: User | null;
};

const ChannelUpdateModal: React.FC<Props> = ({ user }) => {
  const classes = useStyles();
  const [username, setUsername] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!loaded && user !== null) {
      setUsername(user.username);
      setDescription(user.description);
      setLoaded(true);
    }
  }, [loaded, user]);

  return (
    <Container>
      <input
        placeholder="Username"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        className={classes.input}
      />
      <textarea
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        placeholder="Description"
        className={classes.input}
        rows={4}
        style={{ resize: "none", marginTop: "1rem" }}
      />
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(ChannelUpdateModal);

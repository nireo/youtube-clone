import React, { useState, useEffect, ChangeEvent } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { User } from "../../interfaces/User";
import Container from "@material-ui/core/Container";
import { updateUser } from "../../services/user";
import Button from "@material-ui/core/Button";

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

  const handleChannelUpdate = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateUser({ description, username });

    // refresh the site so that we don't need extra code to update user information instantly
    window.location.reload(false);
  };

  return (
    <Container>
      <form onSubmit={handleChannelUpdate}>
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
        <Button
          color="secondary"
          variant="contained"
          type="submit"
          style={{ marginTop: "1rem" }}
        >
          Update
        </Button>
      </form>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(ChannelUpdateModal);

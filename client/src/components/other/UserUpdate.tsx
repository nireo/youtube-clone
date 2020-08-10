import React, { useState, useEffect, ChangeEvent } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { updateUser } from "../../services/user";
import { updateUserAction } from "../../store/userReducer";

type Props = {
  user: User | null;
  updateUserAction: (newUserData: User) => void;
};

const UsernameUpdate: React.FC<Props> = ({ user, updateUserAction }) => {
  const [username, setUsername] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!loaded && user) {
      setUsername(user.username);
      setLoaded(true);
    }
  }, [loaded, user]);

  if (!user) {
    return null;
  }

  const handleUsernameUpdate = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    await updateUser({ username });
    let userCopy = user;
    userCopy.username = username;

    updateUserAction(userCopy);
  };

  return (
    <Container>
      <form onSubmit={handleUsernameUpdate}>
        <TextField
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          placeholder="Username"
          title="Username"
          color="secondary"
          fullWidth
        />
        <button
          className="button button-red"
          type="submit"
          style={{ marginTop: "2rem" }}
        >
          Update user
        </button>
        <Button
          variant="contained"
          style={{ marginTop: "2rem" }}
          color="secondary"
          type="submit"
        >
          Update username
        </Button>
      </form>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps, { updateUserAction })(UsernameUpdate);

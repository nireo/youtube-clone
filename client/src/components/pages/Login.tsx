import React, { useState, ChangeEvent } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { loginAction, registerAction } from "../../store/userReducer";
import { User, Credentials } from "../../interfaces/User";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

type Props = {
  user: User | null;
  loginAction: (credentials: Credentials) => void;
  registerAction: (credentials: Credentials) => void;
};

const Login: React.FC<Props> = ({ loginAction, user, registerAction }) => {
  const [page, setPage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const classes = useStyles();

  if (user) {
    return <Redirect to="/" />;
  }

  const changePage = () => {
    const newPage = page === "register" ? "login" : "register";
    setPage(newPage);
    setUsername("");
    setPassword("");
  };

  const handleFormSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === "" || password === "") return;
    if (page === "login") {
      loginAction({ username, password });
    } else {
      registerAction({ username, password });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {page === "register" ? "Register" : "Login"}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            color="secondary"
            required
            fullWidth
            label="Username"
            name="username"
            autoFocus
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            color="secondary"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            {page === "register" ? "Register" : "Login"}
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link href="#" variant="body2" onClick={() => changePage()}>
                {page === "register"
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps, { loginAction, registerAction })(Login);

import React, { useState } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Redirect } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import AvatarUpdate from "../other/AvatarUpdate";
import BannerUpdate from "../other/BannerUpdate";
import UserUpdate from "../other/UserUpdate";

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  paper: {
    position: "absolute",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

type Props = {
  user: User | null;
};

const SettingsPage: React.FC<Props> = ({ user }) => {
  const classes = useStyles();
  const [modalPage, setModalPage] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  if (!user) {
    return <Redirect to="/" />;
  }

  const showAvatarModal = () => {
    setModalPage(0);
    setOpen(true);
  };

  const showBannerModal = () => {
    setModalPage(1);
    setOpen(true);
  };

  const showUsernameModal = () => {
    setModalPage(2);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Modal open={open} onClose={closeModal} className={classes.modal}>
        <div className={classes.paper}>
          {modalPage === 0 && <AvatarUpdate />}
          {modalPage === 1 && <BannerUpdate />}
          {modalPage === 2 && <UserUpdate />}
        </div>
      </Modal>
      <Typography variant="body1">
        <strong>Account</strong>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Choose how others see you, and what you see on TypeTube
      </Typography>
      <Divider style={{ marginTop: "2rem", marginBottom: "2rem" }} />
      <Typography variant="body1" style={{ marginBottom: "1rem" }}>
        <strong>Your public information</strong>
      </Typography>
      <div
        style={{
          display: "flex",
          marginBottom: "1rem",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex" }}>
          <Avatar
            className={classes.avatar}
            src={`http://localhost:3001/avatars/${user.avatar}`}
          />
          <Typography
            style={{ marginLeft: "0.5rem" }}
            variant="h6"
            color="textPrimary"
          >
            {user.username}
          </Typography>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Button
          style={{ marginRight: "1rem" }}
          variant="contained"
          color="secondary"
          onClick={() => showAvatarModal()}
        >
          Update avatar
        </Button>
        <Button
          style={{ marginRight: "1rem" }}
          variant="contained"
          color="secondary"
          onClick={() => showBannerModal()}
        >
          Update banner
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => showUsernameModal()}
        >
          Update username
        </Button>
      </div>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(SettingsPage);

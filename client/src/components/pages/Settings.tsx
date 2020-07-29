import React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import { Redirect } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";

type Props = {
  user: User | null;
};

const SettingsPage: React.FC<Props> = ({ user }) => {
  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <Container style={{ marginTop: "2rem" }}>
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
          <Avatar src={`http://localhost:3001/avatars/${user.avatar}`} />
          <Typography style={{ marginLeft: "0.5rem" }} color="textPrimary">
            {user.username}
          </Typography>
        </div>
      </div>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(SettingsPage);

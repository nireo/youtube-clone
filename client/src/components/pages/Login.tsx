import React, { useState, ChangeEvent } from "react";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Container maxWidth="md">
      <Card style={{ marginTop: "8rem" }}>
        <form onSubmit={handleLogin}>
          <Typography variant="h6">Login</Typography>
          <TextField
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            placeholder="Username"
          />
          <TextField
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Password"
          />
          <Button variant="contained">Login</Button>
        </form>
      </Card>
    </Container>
  );
};

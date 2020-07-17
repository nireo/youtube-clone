import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

export const Home: React.FC = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: "1rem" }}>
      <Typography variant="h6">Home</Typography>
    </Container>
  );
};

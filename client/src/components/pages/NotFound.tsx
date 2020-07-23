import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

export const NotFound: React.FC = () => {
  return (
    <Container style={{ marginTop: "2rem" }}>
      <Typography variant="h5">404, Not found.</Typography>
      <Typography>The page you're looking for does not exist.</Typography>
    </Container>
  );
};

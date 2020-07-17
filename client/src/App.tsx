import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { DrawerWrapper } from "./components/layout/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Home } from "./components/pages/Home";
import { Login } from "./components/pages/Login";
import { CreateVideo } from "./components/pages/CreateVideo";

function App() {
  const darkTheme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Route
          path="/"
          exact
          render={() => (
            <DrawerWrapper>
              <Home />
            </DrawerWrapper>
          )}
        />
        <Route
          path="/login"
          exact
          render={() => (
            <DrawerWrapper>
              <Login />
            </DrawerWrapper>
          )}
        />
        <Route
          path="/upload"
          exact
          render={() => (
            <DrawerWrapper>
              <CreateVideo />
            </DrawerWrapper>
          )}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;

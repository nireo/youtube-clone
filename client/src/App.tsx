import React, { useEffect, useState } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import DrawerWrapper from "./components/layout/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import { CreateVideo } from "./components/pages/CreateVideo";
import { Search } from "./components/pages/Search";
import WatchVideo from "./components/pages/WatchVideo";
import { connect } from "react-redux";
import { AppState } from "./store";
import { User } from "./interfaces/User";
import { loadLocalStorageUser } from "./store/userReducer";
import Subscriptions from "./components/pages/Subscriptions";
import UserChannel from "./components/pages/UserChannel";

type Props = {
  user: User | null;
  loadLocalStorageUser: () => void;
};

const App: React.FC<Props> = ({ user, loadLocalStorageUser }) => {
  // adding loaded since don't want the app constantly checking the local storage
  const [loaded, setLoaded] = useState<boolean>(false);
  const darkTheme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  useEffect(() => {
    if (!loaded && user === null) {
      loadLocalStorageUser();
      setLoaded(true);
    }
  }, [loaded, user, loadLocalStorageUser]);

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
        <Route
          path="/search"
          exact
          render={() => (
            <DrawerWrapper>
              <Search />
            </DrawerWrapper>
          )}
        />
        <Route
          path="/watch/:id"
          exact
          render={({ match }) => (
            <DrawerWrapper>
              <WatchVideo id={match.params.id} />
            </DrawerWrapper>
          )}
        />
        <Route
          path="/subscriptions"
          exact
          render={() => (
            <DrawerWrapper>
              <Subscriptions />
            </DrawerWrapper>
          )}
        />
        <Route
          path="/channel/:userId"
          exact
          render={({ match }) => (
            <DrawerWrapper>
              <UserChannel id={match.params.userId} />
            </DrawerWrapper>
          )}
        />
      </Router>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps, { loadLocalStorageUser })(App);

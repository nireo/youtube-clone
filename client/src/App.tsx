import React, { useEffect, useState } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
import YourVideos from "./components/pages/YourVideos";
import WatchLater from "./components/pages/WatchLater";
import Library from "./components/pages/Library";
import { NotFound } from "./components/pages/NotFound";
import { DrawerWrapper } from "./components/layout/DrawerWrapper";

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
        <DrawerWrapper>
          <Switch>
            <Route path="/" exact render={() => <Home />} />
            <Route path="/login" exact render={() => <Login />} />
            <Route path="/upload" exact render={() => <CreateVideo />} />
            <Route path="/search" exact render={() => <Search />} />
            <Route
              path="/watch/:id"
              exact
              render={({ match }) => <WatchVideo id={match.params.id} />}
            />
            <Route
              path="/subscriptions"
              exact
              render={() => <Subscriptions />}
            />
            <Route
              path="/channel/:userId"
              exact
              render={({ match }) => <UserChannel id={match.params.userId} />}
            />
            <Route path="/your-videos" exact render={() => <YourVideos />} />
            <Route path="/watch-later" exact render={() => <WatchLater />} />
            <Route path="/library" exact render={() => <Library />} />
            <Route render={() => <NotFound />} />
          </Switch>
        </DrawerWrapper>
      </Router>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps, { loadLocalStorageUser })(App);

import React, { KeyboardEvent, useState } from "react";
import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import HistoryIcon from "@material-ui/icons/History";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { AppState } from "../../store";
import { User } from "../../interfaces/User";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import NotificationWidget from "../other/NotificationWidget";
import SubscriptionsWidget from "../other/SubscriptionsWidget";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    hide: {
      display: "none"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: "rgba(33, 33, 33, 0.98)"
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: -drawerWidth
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    },
    inputRoot: {
      color: "inherit"
    },
    avatar: {
      height: theme.spacing(3),
      width: theme.spacing(3),
      "&:hover": {
        cursor: "pointer"
      }
    },
    searchInput: {
      backgroundColor: "#121212",
      border: "none",
      fontSize: "16px",
      lineHeight: "24px",
      width: "100%",
      boxShadow: "none",
      color: "rgba(255, 255, 255, 0.88)",
      fontFamily: "Roboto, Noto, sans-serif"
    }
  })
);

type Props = {
  user: User | null;
};

const DrawerWrapper: React.FC<Props> = ({ children, user }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(anchorEl);

  const history = useHistory();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleEnterPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const formattedSearch = search.split(" ").join("%");
      history.push(`/search?search=${formattedSearch}`);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRedirect = (page: string) => {
    history.push(page);

    // close the menu
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
        style={{ backgroundColor: "rgba(33, 33, 33, 0.98)" }}
      >
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {open === false && (
              <div style={{ display: "flex" }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, open && classes.hide)}
                >
                  {" "}
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{ marginTop: "0.5rem" }} noWrap>
                  TypeTube
                </Typography>
              </div>
            )}
          </div>
          <div className="search-container">
            <input
              placeholder="Search…"
              value={search}
              onChange={({ target }) => setSearch(target.value)}
              onKeyPress={handleEnterPress}
              className={classes.searchInput}
            />
          </div>
          {user === null ? (
            <Link to="/login">
              <Button variant="contained">Login</Button>
            </Link>
          ) : (
            <div style={{ display: "flex" }}>
              <NotificationWidget />
              <Link to="/upload" style={{ marginRight: "1rem" }}>
                <IconButton
                  edge="end"
                  aria-label="upload-video"
                  style={{ color: "#fff", background: "transparent" }}
                >
                  <VideoCallIcon />
                </IconButton>
              </Link>
              <Avatar
                src={`http://localhost:3001/avatars/${user.avatar}`}
                onClick={handleProfileMenuOpen}
                className={classes.avatar}
                style={{ marginTop: "0.7rem", marginLeft: "0.7rem" }}
              />
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={isMenuOpen}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleRedirect(`/channel/${user.id}`)}>
                  My Channel
                </MenuItem>
                <MenuItem onClick={() => handleRedirect("/settings")}>
                  Settings
                </MenuItem>
                <MenuItem></MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            TypeTube
          </Typography>
        </div>
        <Divider />
        <List>
          <Link to="/" style={{ textDecoration: "none" }}>
            <ListItem button>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "#fff" }} primary="Home" />
            </ListItem>
          </Link>
          <Link to="/trending" style={{ textDecoration: "none" }}>
            <ListItem button>
              <ListItemIcon>
                <WhatshotIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "#fff" }} primary="Trending" />
            </ListItem>
          </Link>
          <Link to="/subscriptions" style={{ textDecoration: "none" }}>
            <ListItem button>
              <ListItemIcon>
                <SubscriptionsIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "#fff" }} primary="Subscriptions" />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <Link to="/library" style={{ textDecoration: "none" }}>
            <ListItem button>
              <ListItemIcon>
                <VideoLibraryIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "#fff" }} primary="Library" />
            </ListItem>
          </Link>
          <Link to="/history" style={{ textDecoration: "none" }}>
            <ListItem button>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "#fff" }} primary="History" />
            </ListItem>
          </Link>
          <Link to="/your-videos" style={{ textDecoration: "none" }}>
            <ListItem button>
              <ListItemIcon>
                <OndemandVideoIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "#fff" }} primary="Your videos" />
            </ListItem>
          </Link>
          <Link to="/watch-later" style={{ textDecoration: "none" }}>
            <ListItem button>
              <ListItemIcon>
                <WatchLaterIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "#fff" }} primary="Watch Later" />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <SubscriptionsWidget />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
        style={{ width: "100%" }}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(DrawerWrapper);

import React, {
  Dispatch,
  SetStateAction,
  useState,
  KeyboardEvent
} from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import { AppState } from "../../store";
import AppBar from "@material-ui/core/AppBar";
import { User } from "../../interfaces/User";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useHistory, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import NotificationWidget from "../other/NotificationWidget";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import Avatar from "@material-ui/core/Avatar";

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) => ({
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
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  }
}));

type Props = {
  user: User | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const Navbar: React.FC<Props> = ({ user, open, setOpen }) => {
  const [search, setSearch] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(anchorEl);
  const history = useHistory();
  const classes = useStyles();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleEnterPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const formattedSearch = search.split(" ").join("+");
      history.push(`/search?search=${formattedSearch}`);
    }
  };

  const handleRedirect = (page: string) => {
    history.push(page);

    // close the menu
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
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
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(Navbar);

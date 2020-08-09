import React, { useState, useEffect, useCallback } from "react";
import { Video } from "../../interfaces/Video";
import { videoSearch } from "../../services/video";
import { useLocation } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { VideoEntryFull } from "../other/VideoEntryFull";
import { Link } from "react-router-dom";
import { User } from "../../interfaces/User";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(16),
    height: theme.spacing(16)
  }
}));

export const Search: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const query = new URLSearchParams(useLocation().search);
  const classes = useStyles();

  const loadVideosWithQuery = useCallback(async () => {
    const search = query.get("search");
    if (search === null) {
      return;
    }

    const data = await videoSearch(search.split(" ").join("+"));
    setVideos(data.videos);
    setUsers(data.users);
  }, [query]);

  useEffect(() => {
    if (!loaded) {
      loadVideosWithQuery();
      setLoaded(true);
    }
  }, [loaded, loadVideosWithQuery]);

  return (
    <div style={{ marginTop: "2rem" }}>
      {loaded && videos.length === 0 && users.length === 0 && (
        <Container>
          <Typography variant="h5">404 Not found.</Typography>
        </Container>
      )}
      {loaded && (videos.length > 0 || users.length > 0) && (
        <Container>
          <Typography style={{ fontSize: "1.2rem" }}>Videos</Typography>
          {videos.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No videos found matching your search.
            </Typography>
          )}
          <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          {videos.length > 0 && (
            <div>
              {videos.map((video: Video) => (
                <VideoEntryFull key={video.id} video={video} />
              ))}
            </div>
          )}
          <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Typography style={{ fontSize: "1.2rem" }}>Users</Typography>
          {users.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No users found matching your search.
            </Typography>
          )}
          {users.length > 0 && (
            <div>
              {users.map((u: User) => (
                <Link
                  key={u.id}
                  to={`/channel/${u.id}`}
                  style={{ paddingBottom: "1rem", textDecoration: "none" }}
                >
                  <div style={{ display: "flex" }}>
                    <Avatar
                      src={`http://localhost:3001/avatars/${u.avatar}`}
                      className={classes.avatar}
                    />
                    <div>
                      <Typography
                        style={{ marginLeft: "1rem", fontSize: "2rem" }}
                        color="textPrimary"
                      >
                        {u.username}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        style={{ marginLeft: "1rem" }}
                      >
                        {u.subscribers} subscribers
                      </Typography>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      )}
    </div>
  );
};

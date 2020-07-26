import { setToken as setVideoToken } from "../services/video";
import { setToken as setUserToken } from "../services/user";
import { setToken as setCommentToken } from "../services/comment";
import { setToken as setPlaylistToken } from "../services/playlist";
import { setToken as setNotificationToken } from "../services/notification";

const setTokens = (token: string) => {
  setVideoToken(token);
  setUserToken(token);
  setCommentToken(token);
  setPlaylistToken(token);
  setNotificationToken(token);
};

export default setTokens;

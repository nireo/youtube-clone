import { setToken as setVideoToken } from "../services/video";
import { setToken as setUserToken } from "../services/user";
import { setToken as setCommentToken } from "../services/comment";

const setTokens = (token: string) => {
  setVideoToken(token);
  setUserToken(token);
  setCommentToken(token);
};

export default setTokens;

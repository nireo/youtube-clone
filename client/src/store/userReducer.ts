import { User, Credentials, UserWithToken } from "../interfaces/User";
import { Dispatch } from "redux";
import { login, register } from "../services/auth";
import setTokens from "../utils/setTokens";
import { getUserWithToken } from "../services/user";

const reducer = (state: User | null = null, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return action.data;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

const loadUserDataFromLocalstorage = (): UserWithToken | undefined => {
  const userDataString: string | null = localStorage.getItem("youtube-user");
  if (!userDataString) {
    return;
  }

  const userDataJSON: UserWithToken = JSON.parse(userDataString);
  return userDataJSON;
};

export const loginAction = (credentials: Credentials) => {
  return async (dispatch: Dispatch) => {
    const data: UserWithToken = await login(credentials);
    setTokens(data.token);
    localStorage.setItem("youtube-user", JSON.stringify(data));
    dispatch({
      type: "LOGIN",
      data: data.user
    });
  };
};

export const registerAction = (credentials: Credentials) => {
  return async (dispatch: Dispatch) => {
    const user = await register(credentials);
    dispatch({
      type: "LOGIN",
      data: user
    });
  };
};

export const logoutAction = () => {
  localStorage.clear();
  return { type: "LOGOUT" };
};

export const loadLocalStorageUser = () => {
  return async (dispatch: Dispatch) => {
    const userDataJSON = loadUserDataFromLocalstorage();
    if (!userDataJSON) {
      return;
    }

    setTokens(userDataJSON.token);
    dispatch({
      type: "LOGIN",
      data: userDataJSON.user
    });
  };
};

export const loadUserWithToken = () => {
  return async (dispatch: Dispatch) => {
    const user: User = await getUserWithToken();
    if (!user) {
      return;
    }

    dispatch({
      type: "LOGIN",
      data: user
    });
  };
};

export const updateUserAction = (newUserData: User) => {
  return async (dispatch: Dispatch) => {
    // update the localstorage
    let userDataJSON = loadUserDataFromLocalstorage();
    if (!userDataJSON) {
      return;
    }
    userDataJSON.user = newUserData;

    localStorage.setItem("youtube-user", JSON.stringify(userDataJSON));
    dispatch({
      type: "LOGIN",
      data: newUserData
    });
  };
};

export default reducer;

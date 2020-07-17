import { User, Credentials } from "../interfaces/User";
import { Dispatch } from "redux";
import { login, register } from "../services/auth";

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

export const loginAction = (credentials: Credentials) => {
  return async (dispatch: Dispatch) => {
    const user = await login(credentials);
    dispatch({
      type: "LOGIN",
      data: user
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

export default reducer;

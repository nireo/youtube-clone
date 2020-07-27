import { User } from "../interfaces/User";
import { Dispatch } from "redux";
import {
  getSubscriptions,
  unsubscribeUser,
  subscribeToUser
} from "../services/user";

const reducer = (state: User[] = [], action: any) => {
  switch (action.type) {
    case "INIT_SUBSCRIPTIONS":
      return action.data;
    case "REMOVE_SUBSCRIPTION":
      return state.filter(
        (subscription: User) => subscription.id !== action.id
      );
    case "SUBSCRIBE":
      return [...state, action.data];
    default:
      return state;
  }
};

export const initSubscriptionsAction = () => {
  return async (dispatch: Dispatch) => {
    const subscriptions = await getSubscriptions();
    dispatch({
      type: "INIT_SUBSCRIPTIONS",
      data: subscriptions
    });
  };
};

export const subscribeToUserAction = (userId: string) => {
  return async (dispatch: Dispatch) => {
    const newSubscribedUser = await subscribeToUser(userId);
    dispatch({
      type: "SUBSCRIBE",
      data: newSubscribedUser
    });
  };
};

export const removeSubscriptionAction = (userId: string) => {
  return async (dispatch: Dispatch) => {
    await unsubscribeUser(userId);
    dispatch({
      type: "REMOVE_SUBSCRIPTION",
      id: userId
    });
  };
};

export default reducer;

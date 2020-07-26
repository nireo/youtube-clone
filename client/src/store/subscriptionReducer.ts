import { User } from "../interfaces/User";
import { Dispatch } from "redux";
import { getSubscriptions, unsubscribeUser } from "../services/user";

const reducer = (state: User[] = [], action: any) => {
  switch (action.type) {
    case "INIT_SUBSCRIPTIONS":
      return action.data;
    case "REMOVE_SUBSCRIPTION":
      return state.filter(
        (subscription: User) => subscription.id !== action.id
      );
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

export const removeSubscription = (userId: string) => {
  return async (dispatch: Dispatch) => {
    await unsubscribeUser(userId);
    dispatch({
      type: "REMOVE_SUBSCRIPTION",
      id: userId
    });
  };
};

export default reducer;

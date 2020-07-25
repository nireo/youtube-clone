import { Notification } from "../interfaces/Notification";
import { Dispatch } from "redux";
import {
  getNotifications,
  deleteNotification,
  readNotification
} from "../services/notification";

const reducer = (state: Notification[] = [], action: any) => {
  switch (action.type) {
    case "INIT_NOTIFICATION":
      return action.data;
    case "DELETE_NOTIFICATION":
      return state.filter(
        (notification: Notification) => notification.id !== action.id
      );
    case "READ_NOTIFICATION":
      let notification = state.find(
        (notification: Notification) => notification.id === action.id
      );
      if (!notification) {
        return state;
      }

      notification.read = true;
      return state.map((n: Notification) =>
        n.id === action.id ? notification : n
      );
    default:
      return state;
  }
};

export const initNotificationsAction = () => {
  return async (dispatch: Dispatch) => {
    const notifications = await getNotifications();
    dispatch({
      type: "INIT_NOTIFICATIONS",
      data: notifications
    });
  };
};

export const deleteNotificationAction = (notificationId: string) => {
  return async (dispatch: Dispatch) => {
    await deleteNotification(notificationId);
    dispatch({
      type: "DELETE_NOTIFICATION",
      id: notificationId
    });
  };
};

export const readNotificationAction = (notificationId: string) => {
  return async (dispatch: Dispatch) => {
    await readNotification(notificationId);
    dispatch({
      type: "READ_NOTIFICATION",
      id: notificationId
    });
  };
};

export default reducer;

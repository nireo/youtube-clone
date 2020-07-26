import axios from "axios";
const baseUrl: string = "/notifications";

let token: string | null = null;

const getConfig = () => ({
  headers: {
    Authorization: token
  }
});

export const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

export const getNotifications = async () => {
  const response = await axios.get(baseUrl, getConfig());
  return response.data;
};

export const deleteNotification = async (notificationId: string) => {
  const response = await axios.delete(
    `${baseUrl}/${notificationId}`,
    getConfig()
  );
  return response.data;
};

export const readNotification = async (notificationId: string) => {
  const response = await axios.patch(
    `${baseUrl}/${notificationId}`,
    getConfig()
  );
  return response.data;
};

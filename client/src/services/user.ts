import axios from "axios";
const baseUrl: string = "/users";

let token: string | null = null;
export const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const getConfig = () => ({
  headers: {
    Authorization: token
  }
});

export const getUserVideos = async (userId: string) => {
  const response = await axios.get(`${baseUrl}/${userId}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

// doesn't need id since it uses the token
export const deleteUser = async () => {
  const response = await axios.delete(baseUrl, getConfig());
  return response.data;
};

export const subscribeToUser = async (userId: string) => {
  const response = await axios.post(
    `${baseUrl}/subscribe/${userId}`,
    getConfig()
  );
  return response.data;
};

export const unsubscribeUser = async (userId: string) => {
  const response = await axios.delete(
    `${baseUrl}/subscribe/${userId}`,
    getConfig()
  );
  return response.data;
};

export const getSubscriptions = async () => {
  const response = await axios.get(`${baseUrl}/subscription`, getConfig());
  return response.data;
};

export const getChannelData = async (userId: string) => {
  const response = await axios.get(`${baseUrl}/channel/${userId}`);
  return response.data;
};

export const getWatchLaterList = async () => {
  const response = await axios.get(`${baseUrl}/watch-later`, getConfig());
  return response.data;
};

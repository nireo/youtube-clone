import axios from "axios";
import { UpdateUser } from "../interfaces/User";
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

const getConfigMultipart = () => ({
  headers: {
    Authorization: token,
    "Content-Type": "multipart/form-data"
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

export const updateUser = async (updatedValues: UpdateUser) => {
  const response = await axios.patch(
    `${baseUrl}/update`,
    updatedValues,
    getConfig()
  );
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

export const getHistoryList = async () => {
  const response = await axios.get(`${baseUrl}/history`, getConfig());
  return response.data;
};

export const getLibraryData = async () => {
  const response = await axios.get(`${baseUrl}/library`, getConfig());
  return response.data;
};

export const setBanner = async (formData: any) => {
  const response = await axios.post(
    `${baseUrl}/banner`,
    formData,
    getConfigMultipart()
  );
  return response.data;
};

export const setDefaultBanner = async () => {
  const response = await axios.delete(`${baseUrl}/banner`, getConfig());
  return response.data;
};

export const setAvatar = async (formData: any) => {
  const response = await axios.post(
    `${baseUrl}/avatar`,
    formData,
    getConfigMultipart()
  );
  return response.data;
};

export const setDefaultAvatar = async () => {
  const response = await axios.delete(`${baseUrl}/avatar`, getConfig());
  return response.data;
};

export const getUserSubscriptions = async (userId: string) => {
  const response = await axios.get(`${baseUrl}/subscriptions/${userId}`);
  return response.data;
};

export const getLikedVideos = async () => {
  const response = await axios.get(`${baseUrl}/liked`, getConfig());
  return response.data;
};

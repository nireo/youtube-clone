import axios from "axios";
import { RateActions, UpdateVideo } from "../interfaces/Video";
const baseUrl: string = "/videos";

let token: string | null = null;

export const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const getConfig = () => ({
  headers: {
    Authorization: token
  }
});

export const deleteVideo = async (videoId: string) => {
  const response = await axios.delete(`${baseUrl}${videoId}`, getConfig());
  return response.data;
};

export const rateVideo = async (action: RateActions, videoId: string) => {
  const response = await axios.patch(
    `${baseUrl}/${action}/${videoId}`,
    getConfig()
  );
  return response.data;
};

export const updateVideo = async (videoId: string, newInfo: UpdateVideo) => {
  const response = await axios.patch(
    `${baseUrl}/${videoId}`,
    newInfo,
    getConfig()
  );
  return response.data;
};

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

const getConfigMultipart = () => ({
  headers: {
    Authorization: token,
    "Content-Type": "multipart/form-data"
  }
});

export const deleteVideo = async (videoId: string) => {
  const response = await axios.delete(`${baseUrl}${videoId}`, getConfig());
  return response.data;
};

export const createVideo = async (formData: any) => {
  const response = await axios.post("/videos", formData, getConfigMultipart());
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

export const getVideos = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export const videoSearch = async (query: string) => {
  const response = await axios.get(`${baseUrl}/search?search=${query}`);
  return response.data;
};

export const getSingleVideo = async (videoId: string) => {
  const response = await axios.get(`${baseUrl}/watch/${videoId}`);
  return response.data;
};

export const getUserVideos = async () => {
  const response = await axios.get(`${baseUrl}/me`, getConfig());
  return response.data;
};

export const getTrendingVideos = async () => {
  const response = await axios.get(`${baseUrl}/trending`);
  return response.data;
};

export const getEditData = async (videoId: string) => {
  const response = await axios.get(`${baseUrl}/edit/${videoId}`, getConfig());
  return response.data;
};

export const updateVideoThumbnail = async (videoId: string, formData: any) => {
  const response = await axios.patch(
    `${baseUrl}/thumbnail/${videoId}`,
    formData,
    getConfigMultipart()
  );
  return response.data;
};

export const updateVideoPrivacyLevel = async (
  newPrivacyLevel: number,
  videoId: string
) => {
  console.log("????");
  const response = await axios.patch(
    `${baseUrl}/privacy/${videoId}`,
    { privacyLevel: newPrivacyLevel },
    getConfig()
  );
  return response.data;
};

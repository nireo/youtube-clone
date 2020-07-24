import axios from "axios";
import { UpdatePlaylist, CreatePlaylist } from "../interfaces/Playlist";
const baseUrl: string = "/playlist";

let token: string | null = null;

export const setToken = (newToken: string) => {
  token = newToken;
};

const getConfig = () => ({
  headers: {
    Authorization: token
  }
});

export const deleteVideoFromPlaylist = async (
  playlistId: string,
  videoId: string
) => {
  const response = await axios.patch(
    `${baseUrl}/video/${playlistId}`,
    { videoId },
    getConfig()
  );
  return response.data;
};

export const addVideoToPlaylist = async (
  playlistId: string,
  videoId: string
) => {
  const response = await axios.post(
    `${baseUrl}/video/${playlistId}`,
    { videoId },
    getConfig()
  );
  return response.data;
};

export const updatePlaylistInfo = async (
  playlistId: string,
  updated: UpdatePlaylist
) => {
  const response = await axios.patch(
    `${baseUrl}/${playlistId}`,
    updated,
    getConfig()
  );
  return response.data;
};

export const deletePlaylist = async (playlistId: string) => {
  const response = await axios.delete(`${baseUrl}/${playlistId}`, getConfig());
  return response.data;
};

export const getUserPlaylists = async (userId: string) => {
  const response = await axios.get(`${baseUrl}/user/${userId}`);
  return response.data;
};

export const createPlaylist = async (newPlaylist: CreatePlaylist) => {
  const response = await axios.post(baseUrl, newPlaylist, getConfig());
  return response.data;
};

export const getPlaylistVideos = async (playlistId: string) => {
  const response = await axios.get(`${baseUrl}/playlist/${playlistId}`);
  return response.data;
};

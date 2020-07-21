import axios from "axios";
import { CreateComment, RateComment } from "../interfaces/Comment";
const baseUrl: string = "/comments";

let token: string | null = null;

export const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const getConfig = () => ({
  headers: {
    Authorization: token
  }
});

export const createComment = async (
  videoId: string,
  comment: CreateComment
) => {
  const response = await axios.post(
    `${baseUrl}/${videoId}`,
    comment,
    getConfig()
  );
  return response.data;
};

export const getComments = async (videoId: string) => {
  const response = await axios.get(`${baseUrl}/${videoId}`);
  return response.data;
};

export const rateComment = async (action: RateComment, commentId: string) => {
  const response = await axios.patch(
    `${baseUrl}/${action}/${commentId}`,
    getConfig()
  );
  return response.data;
};

export const updateComment = async (
  commentId: string,
  updatedComment: CreateComment
) => {
  const response = await axios.patch(
    `${baseUrl}/${commentId}`,
    updatedComment,
    getConfig()
  );
  return response.data;
};

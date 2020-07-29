import axios from "axios";
const baseUrl: string = "/community";

let token: string | null;
export const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const getConfig = () => ({
  headers: {
    Authorization: token
  }
});

export const getUserCommunityPosts = async (userId: string) => {
  const response = await axios.get(`${baseUrl}/${userId}`);
  return response.data;
};

export const createCommunityPost = async (content: string) => {
  const response = await axios.post(baseUrl, { content }, getConfig());
  return response.data;
};

export const deleteCommunityPost = async (postId: string) => {
  const response = await axios.delete(`${baseUrl}/${postId}`, getConfig());
  return response.data;
};

export const rateCommunityPost = async (postId: string, action: string) => {
  const response = await axios.patch(
    `${baseUrl}/${postId}?action=${action}`,
    getConfig()
  );
  return response.data;
};

export const updateCommunityPost = async (postId: string, content: string) => {
  const response = await axios.patch(
    `${baseUrl}/${postId}`,
    { content },
    getConfig()
  );
  return response.data;
};

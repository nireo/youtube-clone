import axios from "axios";
import { Credentials } from "../interfaces/User";
const baseUrl: string = "/auth";

export const register = async (credentials: Credentials) => {
  const response = await axios.post(`${baseUrl}/register`, credentials);
  return response.data;
};

export const login = async (credentials: Credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

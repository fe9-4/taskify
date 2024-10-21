import config from "@/constants/config";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

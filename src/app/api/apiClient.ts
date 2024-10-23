import config from "@/constants/config";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${config.API_URL}/${config.TEAM_ID}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

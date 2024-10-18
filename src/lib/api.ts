import config from "@/constants/config";
import axios from "axios";

export async function fetchData(url: string) {
    const response = await axios.get(`${config.apiUrl}/${config.teamId}/${url}`);
    return response.data;
}


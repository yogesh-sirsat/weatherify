import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/`,
  headers: {
    "Content-type": "application/json",
  },
});

const axiosSpotify: AxiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1/",
  headers: {
    "Content-type": "application/json",
  },
});

export default instance;
export { axiosSpotify, instance as axiosConfig };

import axios from 'axios';

const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/`,
    headers: {
      "Content-type": "application/json",
    },
  });

const axiosSpotify = axios.create({
  baseURL: "https://api.spotify.com/v1/",
  headers: {
    "Content-type": "application/json",
  }
})

export default instance;
export {
  axiosSpotify,
  instance as axiosConfig
};
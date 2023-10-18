import Cookies from "js-cookie";
import axiosConfig from "@/config/axiosConfig";
import { redirect } from "next/navigation";

const getAccessToken = async (isTokenExpired = false) => {
    console.log("token status:", isTokenExpired);

    if (!isTokenExpired) {
      const access_token = Cookies.get("access_token");
      if (access_token) {
        return access_token;
      }
    }

    console.log("Getting new access token");
    try {
      if (Cookies.get("refresh_token")) {
        const response = await axiosConfig.get(
          "spotify_refresh_token"
        );
        if (response.status === 200 && response.data.access_token) {
          return response.data.access_token;
        }
        console.log(response.data);
      } else {
        console.log("Refresh token not found, redirecting to /signin");
        redirect("/signin");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("Refresh token revoked, redirecting to /signin");
        Cookies.remove("refresh_token");
        redirect("/signin");
      }
      console.log("Error", error);
    }
  };

  export default getAccessToken;
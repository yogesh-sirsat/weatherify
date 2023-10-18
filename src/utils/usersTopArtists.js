import { getLocalStorageWithExpiry, setLocalStorageWithExpiry } from "./localStorageWithExpiry";
import { axiosSpotify } from "@/config/axiosConfig";

const getUsersTopArtists = async (user_id, access_token, time_range="short_term") => {
  console.log("getUsersTopArtists: ", getLocalStorageWithExpiry(user_id + "_top_artists"));
  if (getLocalStorageWithExpiry(user_id + "_top_artists") !== null) {
    return getLocalStorageWithExpiry(user_id + "_top_artists");
  }
  try {
    const config = {
      headers: {
        Authorization: "Bearer " + access_token,
      },
      params: {
        limit: 6,
        time_range: time_range,
      },
    };
    const response = await axiosSpotify.get("me/top/artists", config);
    console.log("response: ", response);
    if (response.data.items.length === 0) {
      // if no data from short_term then request again with medium_term
      return getUsersTopArtists(user_id, access_token, "medium_term");
    }
    setLocalStorageWithExpiry(
      user_id + "_top_artists",
      response.data.items,
      24 * 60
    );
    return response.data.items;
  } catch (e) {
    console.log(e);
  }
  console.log("user top artists");

};

const getUsersTopArtistsIds = async (user_id, access_token) => {
  if (getLocalStorageWithExpiry(user_id + "_top_artists_ids")) {
    return getLocalStorageWithExpiry(user_id + "_top_artists_ids");
  }
  const users_top_artists = await getUsersTopArtists(user_id, access_token);
  const users_top_artists_ids = users_top_artists.reduce((result, artist, index) => {
    if (index === 5) {
      // Taking only 5 artists as per the limit of Spotify
      return result;
    }
    if (index > 0) {
      result += ",";
    }
    result += artist.id;
    return result;
  }, "");

  setLocalStorageWithExpiry(
    user_id + "_top_artists_ids",
    users_top_artists_ids,
    24 * 60
  );
  return users_top_artists_ids;
}

export {
  getUsersTopArtists,
  getUsersTopArtistsIds
}
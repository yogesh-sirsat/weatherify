import { getLocalStorageWithExpiry, setLocalStorageWithExpiry } from "./localStorageWithExpiry";
import { axiosSpotify } from "@/config/axiosConfig";
import { SpotifyArtist } from "@/types/spotify";

const getUsersTopArtists = async (
  user_id: string,
  access_token?: string,
  time_range: string = "short_term"
): Promise<SpotifyArtist[]> => {
  const cached = getLocalStorageWithExpiry<SpotifyArtist[]>(user_id + "_top_artists");
  if (cached !== null) {
    return cached;
  }
  
  if (!access_token) {
    return [];
  }

  try {
    const config = {
      headers: { Authorization: "Bearer " + access_token },
      params: { limit: 6, time_range },
    };
    
    const response = await axiosSpotify.get("me/top/artists", config);
    const items = (response.data?.items || []) as SpotifyArtist[];

    if (items.length === 0) {
      if (time_range === "short_term") {
        return getUsersTopArtists(user_id, access_token, "medium_term");
      } else if (time_range === "medium_term") {
        return getUsersTopArtists(user_id, access_token, "long_term");
      }
      return [];
    }
    
    setLocalStorageWithExpiry(user_id + "_top_artists", items, 24 * 60);
    return items;
  } catch (e) {
    console.error("Error fetching top artists:", e);
    return [];
  }
};

const getUsersTopArtistsIds = async (user_id: string, access_token: string): Promise<string> => {
  const cachedIds = getLocalStorageWithExpiry<string>(user_id + "_top_artists_ids");
  if (cachedIds) {
    return cachedIds;
  }
  
  const users_top_artists = await getUsersTopArtists(user_id, access_token);
  const users_top_artists_ids = users_top_artists.slice(0, 5).map(artist => artist.id).join(",");

  setLocalStorageWithExpiry(user_id + "_top_artists_ids", users_top_artists_ids, 24 * 60);
  return users_top_artists_ids;
};

export {
  getUsersTopArtists,
  getUsersTopArtistsIds
}

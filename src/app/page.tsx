"use client";

import { useRouter } from "next/navigation";
import { axiosSpotify, axiosConfig } from "@/config/axiosConfig";
import { useEffect, useState, FC } from "react";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar";
import Genres from "@/components/Genres";
import Weather from "@/app/weather/Weather";
import Recommendations from "@/components/Recommendations";
import UsersTopArtists from "@/app/users-top-artists/UsersTopArtists";
import getAudioFeatures from "@/utils/audioFeatures";
import getAccessToken from "@/utils/getAccessToken";
import { getUsersTopArtistsIds } from "@/utils/usersTopArtists";
import Alert from "@/components/Alert";
import manageAlerts from "@/utils/manageAlerts";
import { themeChange } from "theme-change";
import LoadingScreen from "@/components/LoadingScreen";
import SideNav from "@/components/SideNav";
import { WeatherStatus } from "@/types/weather";
import { RecommendationPriority, SpotifyTrack } from "@/types/spotify";

interface User {
  id: string;
  display_name: string;
  images: Array<{ url: string }>;
}

interface PlaylistBody {
  name: string;
  description: string;
}

const Home: FC = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecommendations, setIsRecommendations] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [weatherStatus, setWeatherStatus] = useState<WeatherStatus | null>(null);
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [priority, setPriority] = useState<RecommendationPriority>("Balanced");
  const [playlistBody, setPlaylistBody] = useState<PlaylistBody>({
    name: "Weatherify Playlist",
    description: "Created with ♡ by Weatherify, Hope you enjoy it!",
  });
  const [selectedTab, setSelectedTab] = useState("weather x time");
  const [user, setUser] = useState<Partial<User>>({});
  const [isHamburger, setIsHamburger] = useState(true);
  const [theme, setTheme] = useState("synthwave");

  const router = useRouter();
  const user_id = Cookies.get("user_id");

  useEffect(() => {
    if (!Cookies.get("refresh_token")) {
      router.push("/signin");
      return;
    }
    themeChange(false);
  }, [router]);

  useEffect(() => {
    if (!user.id) {
      getUserProfileData();
    }
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, []);

  const getUserProfileData = async () => {
    try {
      const u_id = Cookies.get("user_id");
      if (!u_id) return;
      
      const cachedUser = localStorage.getItem(u_id);
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        return;
      }
      const response = await axiosConfig.get(`mongodb/user?id=${u_id}`);
      setUser(response.data.user);
      localStorage.setItem(u_id, JSON.stringify(response.data.user));
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchRecommendations = async () => {
    if (isProcessing || !weatherStatus || !user_id) return;
    setIsProcessing(true);
    try {
      const access_token = await getAccessToken();
      const audio_features = await getAudioFeatures(
        weatherStatus.time_period,
        weatherStatus.main,
        priority
      );

      const params: any = {
        limit: 20,
        target_valence: audio_features.valence, // Fixed typo from 'valance'
        target_energy: audio_features.energy,
        target_tempo: audio_features.tempo,
        target_instrumentalness: audio_features.instrumentalness,
        target_danceability: audio_features.danceability,
        target_acousticness: audio_features.acousticness,
        target_key: audio_features?.key,
        target_mode: audio_features.mode,
        max_duration_ms: 8 * 60 * 1000,
      };

      if (selectedGenres.size > 0) {
        params.seed_genres = Array.from(selectedGenres).join(",");
      } else {
        params.seed_artists = await getUsersTopArtistsIds(user_id, access_token);
      }

      const config = {
        headers: { Authorization: "Bearer " + access_token },
        params,
      };
      
      const response = await axiosSpotify.get("recommendations", config);
      setRecommendations(response.data.tracks);
      setIsRecommendations(true);
      
      setPlaylistBody({
        name: `${weatherStatus.main} x ${weatherStatus.time_period}`,
        description: `Created with 🤍 by Weatherify, Hope you enjoy it! // ${new Date().toLocaleDateString()}`,
      });
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      manageAlerts(setError, "Failed to get recommendations. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const createPlaylist = async () => {
    if (!user_id) return;
    try {
      const access_token = await getAccessToken();
      const uris = recommendations.map((track) => track.uri);
      const config = {
        headers: { Authorization: "Bearer " + access_token },
      };
      
      const response = await axiosSpotify.post(
        `users/${user_id}/playlists`,
        playlistBody,
        config
      );

      await axiosSpotify.post(
        `playlists/${response.data.id}/tracks`,
        { uris },
        config
      );

      setIsRecommendations(false);
      setRecommendations([]);
      
      const spotify_link = response.data.external_urls.spotify;
      const success_msg = `<h4>Playlist created successfully!</h4> <a class="link" rel="noopener noreferrer" target="_blank" href="${spotify_link}">PLAY ON SPOTIFY</a>`;
      
      manageAlerts(setSuccess, success_msg, 10000);
    } catch (err) {
      console.error("Error creating playlist:", err);
      manageAlerts(setError, "Error creating spotify playlist, please try again");
    }
  };

  return (
    <main className="relative">
      {isLoading && <LoadingScreen />}
      <Navbar isHamburger={isHamburger} setIsHamburger={setIsHamburger} setTheme={setTheme} />
      
      <Recommendations
        isRecommendations={isRecommendations}
        setIsRecommendations={setIsRecommendations}
        recommendations={recommendations}
        setRecommendations={setRecommendations}
        fetchRecommendations={fetchRecommendations}
        createPlaylist={createPlaylist}
        isProcessing={isProcessing}
        theme={theme}
      />

      <div className="flex justify-center">
        {error && <Alert type="error" message={error} relativeClasses="bg-error alert-error fixed mt-20 xl:mt-10 mx-4" />}
        {success && <Alert type="success" message={success} relativeClasses="bg-success alert-success fixed mt-20 xl:mt-10 mx-4" />}
      </div>

      <section className="relative md:flex md:flex-row md:gap-1">
        <SideNav setTheme={setTheme} user={user} setSelectedTab={setSelectedTab} selectedTab={selectedTab} isHamburger={isHamburger} />

        <div className="p-2">
          <section className={`${selectedTab === "weather x time" ? "flex" : "hidden"} flex-col gap-2 md:gap-4`}>
            <Weather setWeatherStatus={setWeatherStatus} weatherStatus={weatherStatus} setError={setError} />
            
            <section className="flex flex-col lg:flex-row gap-2 md:gap-4">
              <UsersTopArtists setIsLoading={setIsLoading} user_id={user_id || ""} theme={theme} />
              
              <section className="flex flex-col gap-3 lg:max-w-[350px]">
                <div className="collapse collapse-arrow bg-base-200 w-full max-w-xl shadow-md">
                  <input type="checkbox" />
                  <div className="collapse-title text-2xl font-medium text-accent">Filters</div>
                  <div className="collapse-content">
                    <div className="rounded-2xl bg-base-100 p-4">
                      <div className="flex flex-col gap-2 mb-2">
                        <h2 className="text-accent text-xl font-bold">Priority</h2>
                        <div className="join">
                          {(["Weather", "Balanced", "Time"] as RecommendationPriority[]).map((p) => (
                            <input
                              key={p}
                              className="join-item btn btn-outline btn-accent btn-xs rounded-full"
                              type="radio"
                              name="options"
                              aria-label={p}
                              checked={priority === p}
                              onChange={() => setPriority(p)}
                            />
                          ))}
                        </div>
                      </div>
                      <Genres selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary w-full max-w-xl drop-shadow-lg" onClick={fetchRecommendations}>
                  {isProcessing ? (
                    <><span className="loading loading-spinner"></span>Getting Recommendations...</>
                  ) : (
                    "Get Recommendations"
                  )}
                </button>
              </section>
            </section>
          </section>

          <section className={`${selectedTab === "mood x activity" ? "" : "hidden"} text-6xl inset-x-0 bottom-1/2 fixed font-bold text-center text-accent`}>
            <h1>Coming soon😁</h1>
          </section>
          <section className={`${selectedTab === "you x custom" ? "" : "hidden"} text-6xl inset-x-0 bottom-1/2 fixed font-bold text-center text-accent`}>
            <h1>Coming soon😉</h1>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Home;

"use client";

import { useRouter } from "next/navigation";
import { axiosSpotify, axiosConfig } from "@/config/axiosConfig";
import { useEffect, useState } from "react";
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

export default function Home() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecommendations, setIsRecommendations] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [weatherStatus, setWeatherStatus] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [priority, setPriority] = useState("Balanced");
  const [playlistBody, setPlaylistBody] = useState({
    name: "Weatherify Playlist",
    description: "Created with ♡ by Weatherify, Hope you enjoy it!",
  });
  const [selectedTab, setSelectedTab] = useState("weather x time");
  const [user, setUser] = useState({});
  const [isHamburger, setIsHamburger] = useState(true);
  const [theme, setTheme] = useState("synthwave");

  const router = useRouter();
  const user_id = Cookies.get("user_id");

  useEffect(() => {
    if (!Cookies.get("refresh_token")) {
      return router.push("/signin");
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
      const user_id = Cookies.get("user_id");
      if (localStorage.getItem(user_id)) {
        setUser(JSON.parse(localStorage.getItem(user_id)));
        return;
      }
      const response = await axiosConfig.get(`mongodb/user?id=${user_id}`);
      setUser(response.data.user);
      localStorage.setItem(user_id, JSON.stringify(response.data.user));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecommendations = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const access_token = await getAccessToken();
      const audio_features = await getAudioFeatures(
        weatherStatus.time_period,
        weatherStatus.main,
        priority
      );
      console.log(audio_features);
      const params = {
        limit: 20,
        target_valance: audio_features.valance,
        target_energy: audio_features.energy,
        target_tempo: audio_features.tempo,
        target_instrumentalness: audio_features.instrumentalness,
        target_danceability: audio_features.danceability,
        target_acousticness: audio_features.acousticness,
        target_key: audio_features?.key,
        target_mode: audio_features.mode,
        // Max duration of track set to 8 minutes
        max_duration_ms: 8 * 60 * 1000,
      };
      if (selectedGenres.size) {
        params.seed_genres = Array.from(selectedGenres).join(",");
      } else {
        params.seed_artists = await getUsersTopArtistsIds(
          user_id,
          access_token
        );
      }
      const config = {
        headers: {
          Authorization: "Bearer " + access_token,
        },
        params,
      };
      const response = await axiosSpotify.get("recommendations", config);
      console.log("recommendations: ", response);
      setRecommendations(response.data.tracks);
      setIsRecommendations(true);
      // Set playlist body here, so that it'll be weather and time related
      setPlaylistBody({
        name: `${weatherStatus.main} x ${weatherStatus.time_period}`,
        description:
          "Created with 🤍 by Weatherify, Hope you enjoy it!  // " +
          new Date().toLocaleDateString(),
      });
    } catch (error) {
      console.error(error);
      // res.status(500).json({ error: 'An error occurred' });
    }
    setIsProcessing(false);
    return null;
  };

  const createPlaylist = async () => {
    try {
      const access_token = await getAccessToken();
      console.log(access_token);
      const uris = recommendations.map((track) => track.uri);
      const config = {
        headers: {
          Authorization: "Bearer " + access_token,
        },
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
      console.log(response.data);
      setIsRecommendations(false);
      setRecommendations([]);
      const spotify_link_elem = `
      <a
        class="link"
        rel="noopener noreferrer"
        target="_blank"
        href=${response.data.external_urls.spotify}
      >
        PLAY ON SPOTIFY
      </a>`;
      manageAlerts(
        setSuccess,
        `<h4>Playlist created successfully!</h4> ${spotify_link_elem}`,
        10000
      );
    } catch (error) {
      console.log(error);
      manageAlerts(
        setError,
        "Error creating spotify playlist, please try again"
      );
    }
  };

  return (
    <main className="relative ">
      {isLoading ? <LoadingScreen /> : null}
      <Navbar
        isHamburger={isHamburger}
        setIsHamburger={setIsHamburger}
        setTheme={setTheme}
      />
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
        {error ? (
          <Alert
            type="error"
            message={error}
            relativeClasses="bg-error alert-error fixed mt-20 xl:mt-10 mx-4"
          />
        ) : null}
        {success ? (
          <Alert
            type="success"
            message={success}
            relativeClasses="bg-success alert-success fixed mt-20 xl:mt-10 mx-4"
          />
        ) : null}
      </div>
      <section className="relative md:flex md:flex-row md:gap-1">
        <SideNav
          setTheme={setTheme}
          user={user}
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
          isHamburger={isHamburger}
        />

        <div className="p-2">
          <section
            className={`${
              selectedTab === "weather x time" ? "flex" : "hidden"
            } flex-col gap-2 md:gap-4`}
          >
            <Weather
              setWeatherStatus={setWeatherStatus}
              weatherStatus={weatherStatus}
              setError={setError}
            />
            <section className="flex flex-col lg:flex-row gap-2 md:gap-4">
              <UsersTopArtists
                setIsLoading={setIsLoading}
                user_id={user_id}
                theme={theme}
              />
              <section className="flex flex-col gap-3 lg:max-w-[350px]">
                <div className="collapse collapse-arrow bg-base-200 w-full max-w-xl shadow-md">
                  <input type="checkbox" />
                  <div className="collapse-title text-2xl font-medium text-accent">
                    Filters
                  </div>
                  <div className="collapse-content">
                    <div className="rounded-2xl bg-base-100 p-4">
                      <div
                        className="flex flex-col gap-2 mb-2"
                        id="recommendations-priority"
                      >
                        <h2 className="text-accent text-xl font-bold">
                          Priority
                        </h2>
                        <div className="join">
                          <input
                            className="join-item btn btn-outline btn-accent btn-xs rounded-full"
                            type="radio"
                            name="options"
                            aria-label="Weather"
                            checked={priority === "Weather"}
                            onChange={() => setPriority("Weather")}
                          />
                          <input
                            className="join-item btn btn-outline btn-accent btn-xs rounded-full"
                            type="radio"
                            name="options"
                            aria-label="Balanced"
                            checked={priority === "Balanced"}
                            onChange={() => setPriority("Balanced")}
                          />
                          <input
                            className="join-item btn btn-outline btn-accent btn-xs rounded-full"
                            type="radio"
                            name="options"
                            aria-label="Time"
                            checked={priority === "Time"}
                            onChange={() => setPriority("Time")}
                          />
                        </div>
                      </div>
                      <Genres
                        selectedGenres={selectedGenres}
                        setSelectedGenres={setSelectedGenres}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-primary w-full max-w-xl drop-shadow-lg"
                  onClick={fetchRecommendations}
                >
                  {isProcessing ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Getting Recommendations...
                    </>
                  ) : (
                    "Get Recommendations"
                  )}
                </button>
              </section>
            </section>
          </section>
          <section
            className={`${
              selectedTab === "mood x activity" ? "" : "hidden"
            } text-6xl inset-x-0 bottom-1/2 fixed font-bold text-center text-accent`}
          >
            <h1>Comming soon😁</h1>
          </section>
          <section
            className={`${
              selectedTab === "you x custom" ? "" : "hidden"
            } text-6xl inset-x-0 bottom-1/2 fixed font-bold text-center text-accent`}
          >
            <h1>Comming soon😉</h1>
          </section>
        </div>
      </section>
    </main>
  );
}

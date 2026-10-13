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
import { AudioFeatures, CustomAudioFeatures, PlaylistSettings, RecommendationPriority, SpotifyTrack } from "@/types/spotify";
import CustomRecommendations from "@/components/CustomRecommendations";
import MoodActivityRecommendations from "@/components/MoodActivityRecommendations";

interface User {
  id: string;
  display_name: string;
  images: Array<{ url: string }>;
}

const coverFileToJpegBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const image = new window.Image();
  const objectUrl = URL.createObjectURL(file);
  image.onload = () => {
    const scale = Math.min(1, 640 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      URL.revokeObjectURL(objectUrl);
      if (!blob) return reject(new Error("Could not prepare cover image"));
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }, "image/jpeg", 0.8);
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error("Could not read cover image"));
  };
  image.src = objectUrl;
});

const Home: FC = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecommendations, setIsRecommendations] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [weatherStatus, setWeatherStatus] = useState<WeatherStatus | null>(null);
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [excludedTrackIds, setExcludedTrackIds] = useState<Set<string>>(new Set());
  const [priority, setPriority] = useState<RecommendationPriority>("Balanced");
  const [trackCount, setTrackCount] = useState(20);
  const [playlistSettings, setPlaylistSettings] = useState<PlaylistSettings>({
    name: "Weatherify Playlist",
    description: "Created with ♡ by Weatherify, Hope you enjoy it!",
    isPublic: false,
  });
  const [selectedTab, setSelectedTab] = useState("weather x time");
  const [user, setUser] = useState<Partial<User>>({});
  const [isHamburger, setIsHamburger] = useState(true);
  const [theme, setTheme] = useState("synthwave");
  const [recommendationContext, setRecommendationContext] = useState<{ features: AudioFeatures; discoverNewMusic: boolean } | null>(null);

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

  const fetchRecommendations = async (append = false, customFeatures?: AudioFeatures, discoverNewMusic = false, requestedTrackCount = trackCount, additionalTrackCount = 0, preservePlaylistSettings = false) => {
    if (isProcessing || !user_id || (!weatherStatus && !customFeatures)) return;
    setIsProcessing(true);
    try {
      const access_token = await getAccessToken();
      const audio_features = customFeatures || await getAudioFeatures(
        weatherStatus?.time_period || "Midday",
        weatherStatus?.main || "Clear Sky",
        priority
      );

      const params: any = {
        limit: append ? Math.min(100, Math.max(1, additionalTrackCount)) : requestedTrackCount,
        target_valence: audio_features.valence,
        target_energy: audio_features.energy,
        target_tempo: audio_features.tempo,
        target_instrumentalness: audio_features.instrumentalness,
        target_danceability: audio_features.danceability,
        target_acousticness: audio_features.acousticness,
        target_mode: audio_features.mode,
        target_liveness: audio_features.liveness,
        target_loudness: audio_features.loudness,
        target_speechiness: audio_features.speechiness,
        target_popularity: audio_features.popularity,
        target_duration_ms: audio_features.duration_ms,
        target_time_signature: audio_features.time_signature,
        max_duration_ms: 8 * 60 * 1000,
      };

      if (audio_features.key !== undefined && audio_features.key >= 0) {
        params.target_key = audio_features.key;
      }

      if (selectedGenres.size > 0) {
        params.seed_genres = Array.from(selectedGenres).slice(0, 5).join(",");
      } else if (discoverNewMusic) {
        params.seed_genres = "pop,indie,dance";
      } else {
        const topArtists = await getUsersTopArtistsIds(user_id, access_token);
        if (topArtists && topArtists.trim().length > 0) {
          params.seed_artists = topArtists.split(",").slice(0, 5).join(",");
        } else {
          // Weather-appropriate fallback seed genres if user has no top artists or selected genres
          const w = (weatherStatus.main || "").toLowerCase();
          if (w.includes("rain") || w.includes("drizzle")) {
            params.seed_genres = "chill,acoustic,indie";
          } else if (w.includes("snow") || w.includes("mist") || w.includes("fog")) {
            params.seed_genres = "ambient,acoustic,piano";
          } else if (w.includes("thunder")) {
            params.seed_genres = "rock,electronic,metal";
          } else {
            params.seed_genres = "pop,indie,dance";
          }
        }
      }

      const config = {
        headers: { Authorization: "Bearer " + access_token },
        params,
      };
      
      const response = await axiosSpotify.get("recommendations", config);
      const currentIds = new Set(recommendations.map((track) => track.id));
      const newTracks = (response.data.tracks || []).filter(
        (track: SpotifyTrack) => !append || (!currentIds.has(track.id) && !excludedTrackIds.has(track.id))
      ).slice(0, append ? additionalTrackCount : undefined);
      setRecommendations((current) => append ? [...current, ...newTracks] : newTracks);
      setIsRecommendations(true);
      if (!append) setRecommendationContext({ features: audio_features, discoverNewMusic });
      
      if (!append && !preservePlaylistSettings) setPlaylistSettings({
        name: customFeatures ? "My Custom Weatherify Playlist" : `${weatherStatus?.main} x ${weatherStatus?.time_period}`,
        description: `Created with 🤍 by Weatherify, Hope you enjoy it! // ${new Date().toLocaleDateString()}`,
        isPublic: false,
      });
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      manageAlerts(setError, "Failed to get recommendations. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const createPlaylist = async (settings: PlaylistSettings) => {
    if (!user_id) return;
    try {
      const access_token = await getAccessToken();
      const uris = recommendations.map((track) => track.uri);
      const config = {
        headers: { Authorization: "Bearer " + access_token },
      };
      
      // Use modern POST me/playlists with fallback to legacy users/{user_id}/playlists
      let response;
      try {
        response = await axiosSpotify.post("me/playlists", {
          name: settings.name,
          description: settings.description,
          public: settings.isPublic,
        }, config);
      } catch {
        response = await axiosSpotify.post(
          `users/${user_id}/playlists`,
          { name: settings.name, description: settings.description, public: settings.isPublic },
          config
        );
      }

      if (settings.coverFile) {
        try {
          const imageData = await coverFileToJpegBase64(settings.coverFile);
          await axiosSpotify.put(`playlists/${response.data.id}/images`, imageData, {
            headers: { Authorization: "Bearer " + access_token, "Content-Type": "image/jpeg" },
          });
        } catch (coverError) {
          console.error("Playlist created, but cover upload failed:", coverError);
          manageAlerts(setError, "Playlist created, but Spotify could not upload the cover image.");
        }
      }

      // Use modern POST playlists/{id}/items with fallback to legacy tracks
      try {
        await axiosSpotify.post(
          `playlists/${response.data.id}/items`,
          { uris },
          config
        );
      } catch {
        await axiosSpotify.post(
          `playlists/${response.data.id}/tracks`,
          { uris },
          config
        );
      }

      setIsRecommendations(false);
      setRecommendations([]);
      setExcludedTrackIds(new Set());
      setRecommendationContext(null);
      
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
        onRemoveTrack={(id) => {
          setExcludedTrackIds((current) => new Set(current).add(id));
          setRecommendations((current) => current.filter((track) => track.id !== id));
        }}
        refreshRecommendations={() => recommendationContext && fetchRecommendations(false, recommendationContext.features, recommendationContext.discoverNewMusic, trackCount, 0, true)}
        addMoreTracks={(count) => recommendationContext && fetchRecommendations(true, recommendationContext.features, recommendationContext.discoverNewMusic, trackCount, count)}
        createPlaylist={createPlaylist}
        isProcessing={isProcessing}
        theme={theme}
        playlistSettings={playlistSettings}
      />

      <div className="flex justify-center">
        {error && <Alert type="error" message={error} relativeClasses="bg-error alert-error fixed mt-20 xl:mt-10 mx-4" />}
        {success && <Alert type="success" message={success} relativeClasses="bg-success alert-success fixed mt-20 xl:mt-10 mx-4" />}
      </div>

      <section className="relative md:flex md:flex-row md:gap-1">
        <SideNav setTheme={setTheme} theme={theme} user={user} setSelectedTab={setSelectedTab} selectedTab={selectedTab} isHamburger={isHamburger} />

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
                <label className="flex flex-col gap-2 rounded-box border border-base-300 p-3">
                  <span className="flex items-center justify-between gap-2 font-semibold"><span>Tracks to generate</span><output className="badge badge-primary">{trackCount}</output></span>
                  <span className="text-xs opacity-70">Choose the size of this playlist.</span>
                  <input className="range range-primary range-sm" type="range" min="5" max="100" step="5" value={trackCount} onChange={(event) => setTrackCount(Number(event.target.value))} />
                  <span className="flex justify-between text-xs opacity-60"><span>5 tracks</span><span>100 tracks</span></span>
                </label>
                <button className="btn btn-primary w-full max-w-xl drop-shadow-lg" onClick={() => fetchRecommendations(false)}>
                  {isProcessing ? (
                    <><span className="loading loading-spinner"></span>Getting Recommendations...</>
                  ) : (
                    "Get Recommendations"
                  )}
                </button>
              </section>
            </section>
          </section>

          <section className={`${selectedTab === "mood x activity" ? "flex" : "hidden"} flex-col gap-4 mt-16 md:mt-16 xl:mt-0`}>
            <MoodActivityRecommendations
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              isProcessing={isProcessing}
              onGenerate={(features, discoverNewMusic, count) => fetchRecommendations(false, features, discoverNewMusic, count)}
              trackCount={trackCount}
              setTrackCount={setTrackCount}
            />
          </section>
          <section className={`${selectedTab === "user x custom" ? "flex" : "hidden"} flex-col gap-4 mt-16 md:mt-16 xl:mt-0`}>
            <CustomRecommendations
              weatherStatus={weatherStatus}
              priority={priority}
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              isProcessing={isProcessing}
              onGenerate={(features, discoverNewMusic, count) => fetchRecommendations(false, features, discoverNewMusic, count)}
              trackCount={trackCount}
              setTrackCount={setTrackCount}
            />
          </section>
        </div>
      </section>
    </main>
  );
};

export default Home;

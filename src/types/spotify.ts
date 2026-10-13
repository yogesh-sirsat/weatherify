export interface AudioFeatures {
  valence: number;
  energy: number;
  tempo: number;
  instrumentalness: number;
  danceability: number;
  acousticness: number;
  key: number;
  mode: number;
  liveness?: number;
  loudness?: number;
  speechiness?: number;
  popularity?: number;
  duration_ms?: number;
  time_signature?: number;
}

export type RecommendationPriority = "Balanced" | "Weather" | "Time";

export interface PlaylistSettings {
  name: string;
  description: string;
  isPublic: boolean;
  coverFile?: File | null;
}

export interface CustomAudioFeatures extends AudioFeatures {
  liveness: number;
  loudness: number;
  speechiness: number;
  popularity: number;
  duration_ms: number;
  time_signature: number;
}

export interface SpotifyRecommendationParams {
  limit?: number;
  seed_genres?: string;
  seed_artists?: string;
  seed_tracks?: string;
  target_valence?: number;
  target_energy?: number;
  target_tempo?: number;
  target_instrumentalness?: number;
  target_danceability?: number;
  target_acousticness?: number;
  target_key?: number;
  target_mode?: number;
  target_liveness?: number;
  target_loudness?: number;
  target_speechiness?: number;
  target_popularity?: number;
  target_duration_ms?: number;
  target_time_signature?: number;
  max_duration_ms?: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
  artists: Array<{
    name: string;
    id: string;
  }>;
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  popularity?: number;
  preview_url?: string | null;
}

export interface UserProfile {
  id?: string;
  name?: string;
  image64?: string;
  image300?: string;
  spotify?: string;
  api?: string;
  refresh_token?: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height?: number;
    width?: number;
  }>;
  external_urls: {
    spotify: string;
  };
  popularity: number;
  genres?: string[];
}

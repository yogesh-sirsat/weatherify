import { CustomAudioFeatures } from "@/types/spotify";

export type MoodActivityPriority = "Balanced" | "Mood" | "Activity";

export interface MoodActivityPreset {
  id: string;
  label: string;
  description: string;
  features: CustomAudioFeatures;
}

const featureSet = (features: CustomAudioFeatures): CustomAudioFeatures => features;

// These are product heuristics built from Spotify's documented audio-feature ranges.
// They are targets for ranking, so Spotify may return tracks outside the exact profile.
export const moodPresets: MoodActivityPreset[] = [
  { id: "happy", label: "Happy", description: "Bright, cheerful, and easy to sing along with.", features: featureSet({ valence: 0.85, energy: 0.75, tempo: 122, instrumentalness: 0.08, danceability: 0.78, acousticness: 0.20, key: 0, mode: 1, liveness: 0.18, loudness: -6, speechiness: 0.06, popularity: 60, duration_ms: 210000, time_signature: 4 }) },
  { id: "calm", label: "Calm", description: "Gentle, spacious, and unhurried.", features: featureSet({ valence: 0.55, energy: 0.32, tempo: 78, instrumentalness: 0.45, danceability: 0.42, acousticness: 0.70, key: 9, mode: 0, liveness: 0.12, loudness: -12, speechiness: 0.04, popularity: 45, duration_ms: 240000, time_signature: 4 }) },
  { id: "focused", label: "Focused", description: "Steady and low-distraction for concentration.", features: featureSet({ valence: 0.55, energy: 0.48, tempo: 100, instrumentalness: 0.60, danceability: 0.50, acousticness: 0.45, key: 2, mode: 1, liveness: 0.10, loudness: -10, speechiness: 0.03, popularity: 50, duration_ms: 240000, time_signature: 4 }) },
  { id: "melancholy", label: "Melancholy", description: "Reflective, emotional, and a little darker.", features: featureSet({ valence: 0.25, energy: 0.38, tempo: 88, instrumentalness: 0.35, danceability: 0.40, acousticness: 0.62, key: 9, mode: 0, liveness: 0.10, loudness: -10, speechiness: 0.06, popularity: 45, duration_ms: 230000, time_signature: 4 }) },
  { id: "confident", label: "Confident", description: "Bold, driving, and ready to move forward.", features: featureSet({ valence: 0.72, energy: 0.82, tempo: 128, instrumentalness: 0.08, danceability: 0.74, acousticness: 0.15, key: 7, mode: 1, liveness: 0.20, loudness: -6, speechiness: 0.08, popularity: 60, duration_ms: 210000, time_signature: 4 }) },
  { id: "romantic", label: "Romantic", description: "Warm, intimate, and emotionally open.", features: featureSet({ valence: 0.65, energy: 0.45, tempo: 92, instrumentalness: 0.10, danceability: 0.50, acousticness: 0.58, key: 4, mode: 1, liveness: 0.12, loudness: -9, speechiness: 0.06, popularity: 50, duration_ms: 235000, time_signature: 4 }) },
];

export const activityPresets: MoodActivityPreset[] = [
  { id: "workout", label: "Workout", description: "High-energy, rhythmic tracks for movement.", features: featureSet({ valence: 0.60, energy: 0.90, tempo: 140, instrumentalness: 0.05, danceability: 0.80, acousticness: 0.10, key: 1, mode: 1, liveness: 0.25, loudness: -5, speechiness: 0.05, popularity: 65, duration_ms: 200000, time_signature: 4 }) },
  { id: "study", label: "Study", description: "Consistent, quieter music for reading or learning.", features: featureSet({ valence: 0.55, energy: 0.35, tempo: 80, instrumentalness: 0.70, danceability: 0.35, acousticness: 0.55, key: 5, mode: 1, liveness: 0.08, loudness: -14, speechiness: 0.03, popularity: 40, duration_ms: 260000, time_signature: 4 }) },
  { id: "commute", label: "Commute", description: "A balanced, forward-moving soundtrack for travel.", features: featureSet({ valence: 0.65, energy: 0.65, tempo: 112, instrumentalness: 0.10, danceability: 0.68, acousticness: 0.25, key: 7, mode: 1, liveness: 0.15, loudness: -8, speechiness: 0.06, popularity: 55, duration_ms: 215000, time_signature: 4 }) },
  { id: "cooking", label: "Cooking", description: "Warm, upbeat, and rhythmic for time in the kitchen.", features: featureSet({ valence: 0.72, energy: 0.62, tempo: 110, instrumentalness: 0.08, danceability: 0.70, acousticness: 0.35, key: 0, mode: 1, liveness: 0.18, loudness: -7, speechiness: 0.10, popularity: 55, duration_ms: 210000, time_signature: 4 }) },
  { id: "party", label: "Party", description: "Social, loud, and highly danceable.", features: featureSet({ valence: 0.80, energy: 0.88, tempo: 128, instrumentalness: 0.03, danceability: 0.90, acousticness: 0.08, key: 5, mode: 1, liveness: 0.30, loudness: -5, speechiness: 0.08, popularity: 70, duration_ms: 205000, time_signature: 4 }) },
  { id: "sleep", label: "Sleep & unwind", description: "Slow, soft, and low-intensity for winding down.", features: featureSet({ valence: 0.30, energy: 0.20, tempo: 65, instrumentalness: 0.80, danceability: 0.25, acousticness: 0.80, key: 9, mode: 0, liveness: 0.05, loudness: -18, speechiness: 0.02, popularity: 35, duration_ms: 300000, time_signature: 4 }) },
];

const blend = (mood: CustomAudioFeatures, activity: CustomAudioFeatures, moodWeight: number): CustomAudioFeatures => {
  const activityWeight = 1 - moodWeight;
  const blendNumber = (key: keyof CustomAudioFeatures) => mood[key] * moodWeight + activity[key] * activityWeight;
  return {
    valence: Number(blendNumber("valence").toFixed(3)),
    energy: Number(blendNumber("energy").toFixed(3)),
    tempo: Math.round(blendNumber("tempo")),
    instrumentalness: Number(blendNumber("instrumentalness").toFixed(3)),
    danceability: Number(blendNumber("danceability").toFixed(3)),
    acousticness: Number(blendNumber("acousticness").toFixed(3)),
    key: Math.round(blendNumber("key")),
    mode: moodWeight >= 0.5 ? mood.mode : activity.mode,
    liveness: Number(blendNumber("liveness").toFixed(3)),
    loudness: Math.round(blendNumber("loudness")),
    speechiness: Number(blendNumber("speechiness").toFixed(3)),
    popularity: Math.round(blendNumber("popularity")),
    duration_ms: Math.round(blendNumber("duration_ms")),
    time_signature: Math.round(blendNumber("time_signature")),
  };
};

export const getMoodActivityFeatures = (
  moodId: string | null,
  activityId: string | null,
  priority: MoodActivityPriority = "Balanced"
): CustomAudioFeatures | null => {
  const mood = moodPresets.find((item) => item.id === moodId)?.features;
  const activity = activityPresets.find((item) => item.id === activityId)?.features;
  if (!mood && !activity) return null;
  if (!mood) return activity || null;
  if (!activity) return mood || null;
  if (priority === "Mood") return blend(mood, activity, 0.8);
  if (priority === "Activity") return blend(mood, activity, 0.2);
  return blend(mood, activity, 0.5);
};

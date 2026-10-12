import { AudioFeatures, RecommendationPriority } from "@/types/spotify";
import { TimePeriod } from "@/types/weather";

/**
 * Define audio feature values for different weather conditions.
 * This can be easily extended by adding more cases to the switch.
 */
const audioFeaturesByWeather = async (weatherCondition: string): Promise<AudioFeatures> => {
  switch (weatherCondition) {
    case 'Clear Sky':
      return {
        valence: 0.8,
        energy: 0.7,
        tempo: 120,
        instrumentalness: 0.2,
        danceability: 0.7,
        acousticness: 0.2,
        key: 5,
        mode: 1,
      };
    case 'Partly Clouds':
      return {
        valence: 0.6,
        energy: 0.6,
        tempo: 110,
        instrumentalness: 0.3,
        danceability: 0.6,
        acousticness: 0.3,
        key: 4,
        mode: 1,
      };
    case 'Clouds':
      return {
        valence: 0.5,
        energy: 0.5,
        tempo: 100,
        instrumentalness: 0.4,
        danceability: 0.5,
        acousticness: 0.4,
        key: 3,
        mode: 0,
      };
    case 'Rain':
      return {
        valence: 0.4,
        energy: 0.4,
        tempo: 90,
        instrumentalness: 0.6,
        danceability: 0.4,
        acousticness: 0.7,
        key: 2,
        mode: 0,
      };
    case 'Drizzle':
      return {
        valence: 0.5,
        energy: 0.5,
        tempo: 95,
        instrumentalness: 0.5,
        danceability: 0.5,
        acousticness: 0.6,
        key: 3,
        mode: 0,
      };
    case 'Snow':
      return {
        valence: 0.3,
        energy: 0.3,
        tempo: 80,
        instrumentalness: 0.8,
        danceability: 0.3,
        acousticness: 0.8,
        key: 1,
        mode: 0,
      };
    case 'Thunderstorms':
      return {
        valence: 0.4,
        energy: 0.8,
        tempo: 140,
        instrumentalness: 0.2,
        danceability: 0.6,
        acousticness: 0.5,
        key: 7,
        mode: 1,
      };      
    case 'Tornado':
    case 'Squall':
      return {
        valence: 0.2,
        energy: 0.2,
        tempo: 60,
        instrumentalness: 0.9,
        danceability: 0.2,
        acousticness: 0.9,
        key: 0,
        mode: 1,
      };
    default:
      // Atmosphere (mist, smoke, haze, etc.)
      return {
        valence: 0.4,
        energy: 0.4,
        tempo: 90,
        instrumentalness: 0.4,
        danceability: 0.4,
        acousticness: 0.8,
        key: 4,
        mode: 0,
      };
  }
};

/**
 * Define audio feature values for different time periods.
 */
const audioFeaturesByTime = async (timePeriod: TimePeriod): Promise<AudioFeatures> => {
  switch (timePeriod) {
    case 'Early Morning':
      return {
        valence: 0.7,
        energy: 0.6,
        tempo: 90,
        instrumentalness: 0.3,
        danceability: 0.6,
        acousticness: 0.4,
        key: 4,
        mode: 1,
      };
    case 'Morning':
      return {
        valence: 0.8,
        energy: 0.8,
        tempo: 120,
        instrumentalness: 0.2,
        danceability: 0.7,
        acousticness: 0.3,
        key: 5,
        mode: 1,
      };
    case 'Late Morning':
      return {
        valence: 0.7,
        energy: 0.7,
        tempo: 110,
        instrumentalness: 0.3,
        danceability: 0.6,
        acousticness: 0.4,
        key: 4,
        mode: 1,
      };
    case 'Midday':
      return {
        valence: 0.8,
        energy: 0.8,
        tempo: 130,
        instrumentalness: 0.2,
        danceability: 0.8,
        acousticness: 0.3,
        key: 5,
        mode: 1,
      };
    case 'Early Afternoon':
      return {
        valence: 0.7,
        energy: 0.7,
        tempo: 120,
        instrumentalness: 0.3,
        danceability: 0.7,
        acousticness: 0.3,
        key: 5,
        mode: 1,
      };
    case 'Mid Afternoon':
      return {
        valence: 0.6,
        energy: 0.6,
        tempo: 110,
        instrumentalness: 0.4,
        danceability: 0.6,
        acousticness: 0.4,
        key: 4,
        mode: 1,
      };
    case 'Late Afternoon':
      return {
        valence: 0.5,
        energy: 0.5,
        tempo: 100,
        instrumentalness: 0.5,
        danceability: 0.5,
        acousticness: 0.5,
        key: 3,
        mode: 0,
      };
    case 'Early Evening':
      return {
        valence: 0.7,
        energy: 0.7,
        tempo: 110,
        instrumentalness: 0.3,
        danceability: 0.7,
        acousticness: 0.3,
        key: 6,
        mode: 1,
      };
    case 'Late Evening':
      return {
        valence: 0.6,
        energy: 0.6,
        tempo: 100,
        instrumentalness: 0.4,
        danceability: 0.6,
        acousticness: 0.4,
        key: 4,
        mode: 1,
      };
    case 'Night':
      return {
        valence: 0.5,
        energy: 0.5,
        tempo: 90,
        instrumentalness: 0.5,
        danceability: 0.5,
        acousticness: 0.5,
        key: 9,
        mode: 0,
      };
    case 'Late Night':
      return {
        valence: 0.4,
        energy: 0.4,
        tempo: 80,
        instrumentalness: 0.6,
        danceability: 0.4,
        acousticness: 0.7,
        key: 9,
        mode: 0,
      };
    default:
      return {
        valence: 0.5,
        energy: 0.5,
        tempo: 100,
        instrumentalness: 0.5,
        danceability: 0.5,
        acousticness: 0.5,
        key: 5,
        mode: 1,
      };
  }
};

const key_mapping: Record<TimePeriod, Record<string, number>> = {
  'Early Morning': {
    'Clear Sky': 0,
    'Partly Clouds': 7,
    'Clouds': 2,
    'Rain': 9,
    'Drizzle': 4,
    'Snow': 11,
    'Thunderstorms': 5,
    'Atmosphere': 1,
    'Extreme': 8,
  },
  'Morning': {
    'Clear Sky': 3,
    'Partly Clouds': 10,
    'Clouds': 6,
    'Rain': 1,
    'Drizzle': 8,
    'Snow': 3,
    'Thunderstorms': 10,
    'Atmosphere': 6,
    'Extreme': 0,
  },
  'Late Morning': {
    'Clear Sky': 5,
    'Partly Clouds': 0,
    'Clouds': 7,
    'Rain': 2,
    'Drizzle': 9,
    'Snow': 4,
    'Thunderstorms': 11,
    'Atmosphere': 8,
    'Extreme': 1,
  },
  'Midday': {
    'Clear Sky': 7,
    'Partly Clouds': 2,
    'Clouds': 9,
    'Rain': 4,
    'Drizzle': 11,
    'Snow': 5,
    'Thunderstorms': 0,
    'Atmosphere': 6,
    'Extreme': 3,
  },
  'Early Afternoon': {
    'Clear Sky': 1,
    'Partly Clouds': 8,
    'Clouds': 3,
    'Rain': 10,
    'Drizzle': 6,
    'Snow': 1,
    'Thunderstorms': 8,
    'Atmosphere': 3,
    'Extreme': 7,
  },
  'Mid Afternoon': {
    'Clear Sky': 4,
    'Partly Clouds': 11,
    'Clouds': 5,
    'Rain': 0,
    'Drizzle': 7,
    'Snow': 2,
    'Thunderstorms': 9,
    'Atmosphere': 10,
    'Extreme': 2,
  },
  'Late Afternoon': {
    'Clear Sky': 3,
    'Partly Clouds': 10,
    'Clouds': 6,
    'Rain': 1,
    'Drizzle': 8,
    'Snow': 3,
    'Thunderstorms': 10,
    'Atmosphere': 6,
    'Extreme': 0,
  },
  'Early Evening': {
    'Clear Sky': 11,
    'Partly Clouds': 5,
    'Clouds': 0,
    'Rain': 7,
    'Drizzle': 2,
    'Snow': 9,
    'Thunderstorms': 4,
    'Atmosphere': 11,
    'Extreme': 5,
  },
  'Late Evening': {
    'Clear Sky': 6,
    'Partly Clouds': 0,
    'Clouds': 7,
    'Rain': 2,
    'Drizzle': 9,
    'Snow': 4,
    'Thunderstorms': 11,
    'Atmosphere': 8,
    'Extreme': 1,
  },
  'Night': {
    'Clear Sky': 9,
    'Partly Clouds': 5,
    'Clouds': 0,
    'Rain': 7,
    'Drizzle': 2,
    'Snow': 9,
    'Thunderstorms': 4,
    'Atmosphere': 11,
    'Extreme': 6,
  },
  'Late Night': {
    'Clear Sky': 4,
    'Partly Clouds': 10,
    'Clouds': 6,
    'Rain': 1,
    'Drizzle': 8,
    'Snow': 3,
    'Thunderstorms': 10,
    'Atmosphere': 6,
    'Extreme': 0,
  },
};

/**
 * Function to blend audio feature values with a weighted average.
 * Robustly typed and prepared for future feature flags (priority, custom vibes).
 */
const getAudioFeatures = async (
  time_period: TimePeriod,
  weather_condition: string,
  priority: RecommendationPriority = 'Balanced'
): Promise<AudioFeatures> => {
  const audio_features_from_time = await audioFeaturesByTime(time_period);
  const audio_features_from_weather = await audioFeaturesByWeather(weather_condition);

  let time_weight = 1;
  let weather_weight = 1;
  const blended_audio_features: Partial<AudioFeatures> = {};

  switch (priority) {
    case 'Weather':
      weather_weight = 2;
      blended_audio_features.key = audio_features_from_weather.key;
      blended_audio_features.mode = audio_features_from_weather.mode;
      break;
    case 'Time':
      time_weight = 2;
      blended_audio_features.key = audio_features_from_time.key;
      blended_audio_features.mode = audio_features_from_time.mode;
      break;
    case 'Balanced':
    default:
      time_weight = 1.5;
      weather_weight = 1.5;
      
      const period_map = key_mapping[time_period];
      let key = period_map[weather_condition];

      if (key === undefined) {
        if (weather_condition === "Tornado" || weather_condition === "Squall") {
          key = period_map["Extreme"];
        } else {
          key = period_map["Atmosphere"];
        }
      }
      blended_audio_features.key = key;

      if (audio_features_from_time.mode !== audio_features_from_weather.mode) {
        // Minor mode preferred between both major and minor.
        blended_audio_features.mode = 0;
      } else {
        blended_audio_features.mode = audio_features_from_time.mode;
      }
      break;
  }

  // Iterate through numerical features to blend them
  for (const feature of [
    'valence', 'energy', 'tempo', 'instrumentalness', 'danceability', 'acousticness'
  ] as const) {
    blended_audio_features[feature] = Number((
      (time_weight * audio_features_from_time[feature] +
        weather_weight * audio_features_from_weather[feature]) /
      (time_weight + weather_weight)).toFixed(4));
  }

  return blended_audio_features as AudioFeatures;
};

export default getAudioFeatures;

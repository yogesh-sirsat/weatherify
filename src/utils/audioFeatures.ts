import { AudioFeatures, RecommendationPriority } from "@/types/spotify";
import { TimePeriod } from "@/types/weather";

/**
 * Normalizes any OpenWeatherMap weather string or custom tag
 * into a canonical weather category.
 */
export const normalizeWeatherCategory = (rawCondition: string): string => {
  const c = (rawCondition || "").trim().toLowerCase();

  if (c.includes("clear") || c === "sunny") {
    return "Clear Sky";
  }
  if (
    c.includes("partly") ||
    c === "few clouds" ||
    c === "scattered clouds"
  ) {
    return "Partly Clouds";
  }
  if (c.includes("cloud") || c.includes("overcast")) {
    return "Clouds";
  }
  if (c.includes("drizzle")) {
    return "Drizzle";
  }
  if (c.includes("thunder") || c.includes("storm")) {
    return "Thunderstorm";
  }
  if (c.includes("rain") || c.includes("shower")) {
    return "Rain";
  }
  if (c.includes("snow") || c.includes("sleet") || c.includes("blizzard")) {
    return "Snow";
  }
  if (c.includes("tornado") || c.includes("squall") || c.includes("extreme")) {
    return "Extreme";
  }
  if (
    c.includes("mist") ||
    c.includes("fog") ||
    c.includes("haze") ||
    c.includes("smoke") ||
    c.includes("dust") ||
    c.includes("sand") ||
    c.includes("ash")
  ) {
    return "Atmosphere";
  }
  return "Clear Sky";
};

/**
 * Define audio feature values for different weather conditions.
 * Tuned accurately to reflect emotional resonance and musical textures of weather.
 */
const audioFeaturesByWeather = async (weatherCondition: string): Promise<AudioFeatures> => {
  const category = normalizeWeatherCategory(weatherCondition);

  switch (category) {
    case "Clear Sky":
      // Bright, joyful, uplifting, modern, energetic
      return {
        valence: 0.82,
        energy: 0.72,
        tempo: 122,
        instrumentalness: 0.10,
        danceability: 0.72,
        acousticness: 0.20,
        key: 0, // C Major
        mode: 1, // Major
      };

    case "Partly Clouds":
      // Warm, breezy, easygoing, mellow flow
      return {
        valence: 0.68,
        energy: 0.62,
        tempo: 114,
        instrumentalness: 0.15,
        danceability: 0.66,
        acousticness: 0.30,
        key: 7, // G Major
        mode: 1, // Major
      };

    case "Clouds":
      // Contemplative, introspective indie/alt/lo-fi, relaxed groove
      return {
        valence: 0.48,
        energy: 0.46,
        tempo: 98,
        instrumentalness: 0.32,
        danceability: 0.52,
        acousticness: 0.48,
        key: 9, // A Minor
        mode: 0, // Minor
      };

    case "Drizzle":
      // Gentle, soothing pitter-patter, acoustic warmth, low tempo
      return {
        valence: 0.44,
        energy: 0.40,
        tempo: 92,
        instrumentalness: 0.38,
        danceability: 0.48,
        acousticness: 0.65,
        key: 2, // D Minor
        mode: 0, // Minor
      };

    case "Rain":
      // Melancholic beauty, cozy coffeehouse, emotive neo-soul / jazz / lo-fi
      return {
        valence: 0.35,
        energy: 0.36,
        tempo: 86,
        instrumentalness: 0.48,
        danceability: 0.42,
        acousticness: 0.74,
        key: 2, // D Minor
        mode: 0, // Minor
      };

    case "Thunderstorm":
      // Intense, high adrenaline, electric overdrive, driving drums & bass
      return {
        valence: 0.34,
        energy: 0.88,
        tempo: 138,
        instrumentalness: 0.25,
        danceability: 0.58,
        acousticness: 0.12,
        key: 4, // E Minor
        mode: 0, // Minor
      };

    case "Snow":
      // Peaceful, hushed winter wonderland, delicate piano/bells, ambient strings
      return {
        valence: 0.42,
        energy: 0.28,
        tempo: 76,
        instrumentalness: 0.62,
        danceability: 0.34,
        acousticness: 0.84,
        key: 11, // B Minor
        mode: 0, // Minor
      };

    case "Extreme":
      // Turbulent, raw power, urgent tempo
      return {
        valence: 0.22,
        energy: 0.94,
        tempo: 152,
        instrumentalness: 0.35,
        danceability: 0.44,
        acousticness: 0.08,
        key: 1, // C# Minor
        mode: 0, // Minor
      };

    case "Atmosphere":
    default:
      // Mist, fog, haze: dream pop, shoegaze, ethereal, hazy ambient textures
      return {
        valence: 0.40,
        energy: 0.34,
        tempo: 84,
        instrumentalness: 0.55,
        danceability: 0.38,
        acousticness: 0.72,
        key: 5, // F / Dm
        mode: 0, // Minor
      };
  }
};

/**
 * Define audio feature values for different time periods.
 * Reflects natural human circadian rhythms throughout the 24-hour cycle.
 */
const audioFeaturesByTime = async (timePeriod: TimePeriod): Promise<AudioFeatures> => {
  switch (timePeriod) {
    case "Early Morning":
      // 4am - 6am: Dawn awakening, serene rise, acoustic freshness
      return {
        valence: 0.70,
        energy: 0.52,
        tempo: 88,
        instrumentalness: 0.35,
        danceability: 0.52,
        acousticness: 0.58,
        key: 4,
        mode: 1,
      };

    case "Morning":
      // 6am - 8am: Energizing start, optimistic, active tempo
      return {
        valence: 0.78,
        energy: 0.72,
        tempo: 116,
        instrumentalness: 0.12,
        danceability: 0.68,
        acousticness: 0.28,
        key: 5,
        mode: 1,
      };

    case "Late Morning":
      // 8am - 10am: Focus, productivity, bright forward momentum
      return {
        valence: 0.76,
        energy: 0.74,
        tempo: 120,
        instrumentalness: 0.15,
        danceability: 0.66,
        acousticness: 0.25,
        key: 4,
        mode: 1,
      };

    case "Midday":
      // 10am - 12pm: Peak sun, cheerful, dynamic
      return {
        valence: 0.80,
        energy: 0.78,
        tempo: 125,
        instrumentalness: 0.10,
        danceability: 0.74,
        acousticness: 0.20,
        key: 5,
        mode: 1,
      };

    case "Early Afternoon":
      // 12pm - 2pm: Lunchtime vibes, social, rhythmic
      return {
        valence: 0.74,
        energy: 0.70,
        tempo: 120,
        instrumentalness: 0.15,
        danceability: 0.70,
        acousticness: 0.26,
        key: 5,
        mode: 1,
      };

    case "Mid Afternoon":
      // 2pm - 4pm: Post-lunch groove, steady focus
      return {
        valence: 0.66,
        energy: 0.62,
        tempo: 112,
        instrumentalness: 0.22,
        danceability: 0.64,
        acousticness: 0.35,
        key: 4,
        mode: 1,
      };

    case "Late Afternoon":
      // 4pm - 6pm: Golden hour, transition, gentle unwind
      return {
        valence: 0.62,
        energy: 0.54,
        tempo: 104,
        instrumentalness: 0.28,
        danceability: 0.60,
        acousticness: 0.42,
        key: 3,
        mode: 0,
      };

    case "Early Evening":
      // 6pm - 8pm: Warm evening breeze, dinner/social chill
      return {
        valence: 0.68,
        energy: 0.64,
        tempo: 108,
        instrumentalness: 0.18,
        danceability: 0.68,
        acousticness: 0.32,
        key: 6,
        mode: 1,
      };

    case "Late Evening":
      // 8pm - 10pm: Nightfall, smooth relaxation, lower tempo
      return {
        valence: 0.56,
        energy: 0.50,
        tempo: 96,
        instrumentalness: 0.32,
        danceability: 0.58,
        acousticness: 0.48,
        key: 4,
        mode: 1,
      };

    case "Night":
      // 10pm - 12am: Deep night, moody lo-fi, peaceful solitude
      return {
        valence: 0.46,
        energy: 0.40,
        tempo: 86,
        instrumentalness: 0.48,
        danceability: 0.48,
        acousticness: 0.58,
        key: 9,
        mode: 0,
      };

    case "Late Night":
      // 12am - 4am: Midnight stillness, ambient, meditative, sleep
      return {
        valence: 0.36,
        energy: 0.28,
        tempo: 74,
        instrumentalness: 0.68,
        danceability: 0.36,
        acousticness: 0.78,
        key: 9,
        mode: 0,
      };

    default:
      return {
        valence: 0.55,
        energy: 0.55,
        tempo: 105,
        instrumentalness: 0.25,
        danceability: 0.58,
        acousticness: 0.40,
        key: 5,
        mode: 1,
      };
  }
};

const key_mapping: Record<TimePeriod, Record<string, number>> = {
  "Early Morning": {
    "Clear Sky": 0,
    "Partly Clouds": 7,
    "Clouds": 2,
    "Rain": 9,
    "Drizzle": 4,
    "Snow": 11,
    "Thunderstorm": 5,
    "Atmosphere": 1,
    "Extreme": 8,
  },
  "Morning": {
    "Clear Sky": 3,
    "Partly Clouds": 10,
    "Clouds": 6,
    "Rain": 1,
    "Drizzle": 8,
    "Snow": 3,
    "Thunderstorm": 10,
    "Atmosphere": 6,
    "Extreme": 0,
  },
  "Late Morning": {
    "Clear Sky": 5,
    "Partly Clouds": 0,
    "Clouds": 7,
    "Rain": 2,
    "Drizzle": 9,
    "Snow": 4,
    "Thunderstorm": 11,
    "Atmosphere": 8,
    "Extreme": 1,
  },
  "Midday": {
    "Clear Sky": 7,
    "Partly Clouds": 2,
    "Clouds": 9,
    "Rain": 4,
    "Drizzle": 11,
    "Snow": 5,
    "Thunderstorm": 0,
    "Atmosphere": 6,
    "Extreme": 3,
  },
  "Early Afternoon": {
    "Clear Sky": 1,
    "Partly Clouds": 8,
    "Clouds": 3,
    "Rain": 10,
    "Drizzle": 6,
    "Snow": 1,
    "Thunderstorm": 8,
    "Atmosphere": 3,
    "Extreme": 7,
  },
  "Mid Afternoon": {
    "Clear Sky": 4,
    "Partly Clouds": 11,
    "Clouds": 5,
    "Rain": 0,
    "Drizzle": 7,
    "Snow": 2,
    "Thunderstorm": 9,
    "Atmosphere": 10,
    "Extreme": 2,
  },
  "Late Afternoon": {
    "Clear Sky": 3,
    "Partly Clouds": 10,
    "Clouds": 6,
    "Rain": 1,
    "Drizzle": 8,
    "Snow": 3,
    "Thunderstorm": 10,
    "Atmosphere": 6,
    "Extreme": 0,
  },
  "Early Evening": {
    "Clear Sky": 11,
    "Partly Clouds": 5,
    "Clouds": 0,
    "Rain": 7,
    "Drizzle": 2,
    "Snow": 9,
    "Thunderstorm": 4,
    "Atmosphere": 11,
    "Extreme": 5,
  },
  "Late Evening": {
    "Clear Sky": 6,
    "Partly Clouds": 0,
    "Clouds": 7,
    "Rain": 2,
    "Drizzle": 9,
    "Snow": 4,
    "Thunderstorm": 11,
    "Atmosphere": 8,
    "Extreme": 1,
  },
  "Night": {
    "Clear Sky": 9,
    "Partly Clouds": 5,
    "Clouds": 0,
    "Rain": 7,
    "Drizzle": 2,
    "Snow": 9,
    "Thunderstorm": 4,
    "Atmosphere": 11,
    "Extreme": 6,
  },
  "Late Night": {
    "Clear Sky": 4,
    "Partly Clouds": 10,
    "Clouds": 6,
    "Rain": 1,
    "Drizzle": 8,
    "Snow": 3,
    "Thunderstorm": 10,
    "Atmosphere": 6,
    "Extreme": 0,
  },
};

/**
 * Blends audio feature values with weighted balancing based on user priority.
 */
const getAudioFeatures = async (
  time_period: TimePeriod,
  weather_condition: string,
  priority: RecommendationPriority = "Balanced"
): Promise<AudioFeatures> => {
  const audio_features_from_time = await audioFeaturesByTime(time_period);
  const audio_features_from_weather = await audioFeaturesByWeather(weather_condition);

  let time_weight = 1;
  let weather_weight = 1;
  const blended_audio_features: Partial<AudioFeatures> = {};

  switch (priority) {
    case "Weather":
      weather_weight = 2.2;
      time_weight = 0.8;
      blended_audio_features.key = audio_features_from_weather.key;
      blended_audio_features.mode = audio_features_from_weather.mode;
      break;

    case "Time":
      time_weight = 2.2;
      weather_weight = 0.8;
      blended_audio_features.key = audio_features_from_time.key;
      blended_audio_features.mode = audio_features_from_time.mode;
      break;

    case "Balanced":
    default:
      time_weight = 1.5;
      weather_weight = 1.5;

      const category = normalizeWeatherCategory(weather_condition);
      const period_map = key_mapping[time_period] || key_mapping["Midday"];
      let key = period_map[category];

      if (key === undefined) {
        key = period_map["Atmosphere"] ?? 0;
      }
      blended_audio_features.key = key;

      if (audio_features_from_time.mode !== audio_features_from_weather.mode) {
        // Minor mode preferred between both major and minor for rich color
        blended_audio_features.mode = 0;
      } else {
        blended_audio_features.mode = audio_features_from_time.mode;
      }
      break;
  }

  // Iterate through numerical features to calculate weighted average
  for (const feature of [
    "valence",
    "energy",
    "tempo",
    "instrumentalness",
    "danceability",
    "acousticness",
  ] as const) {
    const weightedVal =
      (time_weight * audio_features_from_time[feature] +
        weather_weight * audio_features_from_weather[feature]) /
      (time_weight + weather_weight);

    // Keep tempo rounded to 1 decimal place, others to 3 decimals
    blended_audio_features[feature] =
      feature === "tempo"
        ? Number(weightedVal.toFixed(1))
        : Number(weightedVal.toFixed(3));
  }

  return blended_audio_features as AudioFeatures;
};

export default getAudioFeatures;

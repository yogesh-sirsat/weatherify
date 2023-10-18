// Define audio feature values for different weather conditions
const audioFeaturesByWeather = async (weatherCondition) => {
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

// Define audio feature values for different time periods
const audioFeaturesByTime = async (timePeriod) => {
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
        }
      default:
        // Default values for unknown time periods
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

  const key_mapping = {
    'Early Morning': {
      'Clear Sky': 0,       // C Major
      'Partly Clouds': 7,  // G Major
      'Clouds': 2,          // D Major
      'Rain': 9,            // A Major
      'Drizzle': 4,         // E Major
      'Snow': 11,           // B Major
      'Thunderstorms': 5,   // F Major
      'Atmosphere': 1,             // C# Major
      'Extreme': 8,         // G# Major
    },
    'Morning': {
      'Clear Sky': 3,       // D# Major
      'Partly Clouds': 10, // A# Major
      'Clouds': 6,          // F# Major
      'Rain': 1,            // C# Major
      'Drizzle': 8,         // G# Major
      'Snow': 3,            // D# Major
      'Thunderstorms': 10,  // A# Major
      'Atmosphere': 6,             // F# Major
      'Extreme': 0,         // C Major
    },
    'Late Morning': {
      'Clear Sky': 5,       // F Major
      'Partly Clouds': 0,  // C Major
      'Clouds': 7,          // G Major
      'Rain': 2,            // D Major
      'Drizzle': 9,         // A Major
      'Snow': 4,            // E Major
      'Thunderstorms': 11,  // B Major
      'Atmosphere': 8,             // G# Major
      'Extreme': 1,         // C# Major
    },
    'Midday': {
        'Clear Sky': 7,       // G Major
        'Partly Clouds': 2,  // D Major
        'Clouds': 9,          // A Major
        'Rain': 4,            // E Major
        'Drizzle': 11,        // B Major
        'Snow': 5,            // F Major
        'Thunderstorms': 0,  // C Major
        'Atmosphere': 6,             // F# Major
        'Extreme': 3,         // D# Major
      },
      'Early Afternoon': {
        'Clear Sky': 1,       // C# Major
        'Partly Clouds': 8,  // G# Major
        'Clouds': 3,          // D# Major
        'Rain': 10,           // A# Major
        'Drizzle': 6,         // F# Major
        'Snow': 1,            // C# Major
        'Thunderstorms': 8,  // G# Major
        'Atmosphere': 3,             // D# Major
        'Extreme': 7,         // G Major
      },
      'Mid-Afternoon': {
        'Clear Sky': 4,       // E Major
        'Partly Clouds': 11,  // B Major
        'Clouds': 5,          // F Major
        'Rain': 0,            // C Major
        'Drizzle': 7,         // G Major
        'Snow': 2,            // D Major
        'Thunderstorms': 9,  // A Major
        'Atmosphere': 10,            // A# Major
        'Extreme': 2,         // D Major
      },
      'Late Afternoon': {
        'Clear Sky': 3,       // D# Major
        'Partly Clouds': 10,  // A# Major
        'Clouds': 6,          // F# Major
        'Rain': 1,            // C# Major
        'Drizzle': 8,         // G# Major
        'Snow': 3,            // D# Major
        'Thunderstorms': 10,  // A# Major
        'Atmosphere': 6,             // F# Major
        'Extreme': 0,         // C Major
      },
      'Early Evening': {
        'Clear Sky': 11,       // B Major
        'Partly Clouds': 5,   // F Major
        'Clouds': 0,          // C Major
        'Rain': 7,            // G Major
        'Drizzle': 2,         // D Major
        'Snow': 9,            // A Major
        'Thunderstorms': 4,   // E Major
        'Atmosphere': 11,            // B Major
        'Extreme': 5,         // F Major
      },
      'Late Evening': {
        'Clear Sky': 6,        // F# Major
        'Partly Clouds': 0,   // C Major
        'Clouds': 7,          // G Major
        'Rain': 2,            // D Major
        'Drizzle': 9,         // A Major
        'Snow': 4,            // E Major
        'Thunderstorms': 11,  // B Major
        'Atmosphere': 8,             // G# Major
        'Extreme': 1,         // C# Major
      },
      'Night': {
        'Clear Sky': 9,       // A Major
        'Partly Clouds': 5,  // F Major
        'Clouds': 0,          // C Major
        'Rain': 7,            // G Major
        'Drizzle': 2,         // D Major
        'Snow': 9,            // A Major
        'Thunderstorms': 4,  // E Major
        'Atmosphere': 11,            // B Major
        'Extreme': 6,         // F# Major
      },
      'Late Night': {
        'Clear Sky': 4,       // E Major
        'Partly Clouds': 10,  // A# Major
        'Clouds': 6,          // F# Major
        'Rain': 1,            // C# Major
        'Drizzle': 8,         // G# Major
        'Snow': 3,            // D# Major
        'Thunderstorms': 10,  // A# Major
        'Atmosphere': 6,             // F# Major
        'Extreme': 0,         // C Major
      },
  };
  // Source for keys : https://ledgernote.com/blog/interesting/musical-key-characteristics-emotions/
  
  // Function to blend audio feature values with a weighted average
  const getAudioFeatures = async (time_period, weather_condition, priority='Balanced') => {
    console.log(time_period, weather_condition, priority);
    const audio_features_from_time = await audioFeaturesByTime(time_period);
    const audio_features_from_weather = await audioFeaturesByWeather(weather_condition);
  
    // Define weights for time period and weather (adjust these as needed)
    let time_weight = 1;
    let weather_weight = 1;
    // Calculate the blended audio feature values
    const blended_audio_features = {};
  
    switch (priority) {
      case 'Weather':
        weather_weight = 2; // More weight on weather
        blended_audio_features["key"] = audio_features_from_weather["key"];
        blended_audio_features["mode"] = audio_features_from_weather["mode"];
        break;
      case 'Time':
        time_weight = 2; // More weight on time period
        blended_audio_features["key"] = audio_features_from_time["key"];
        blended_audio_features["mode"] = audio_features_from_time["mode"];
        break;
      default:
        // Default to a balanced blend
        time_weight = 1.5; // Equal weight on both
        weather_weight = 1.5; // Equal weight on both
        blended_audio_features["key"] = key_mapping[time_period][weather_condition];
        // Weather condition is not found, in key mapping
        if (blended_audio_features["key"] === undefined) {
          if (weather_condition === "Tornado" || weather_condition === "Squall") {
            blended_audio_features["key"] = key_mapping[time_period]["Extreme"];
          } else {
            blended_audio_features["key"] = key_mapping[time_period]["Atmosphere"];
          }
        }
        if (audio_features_from_time["mode"] !== audio_features_from_weather["mode"]) {
          // Minor mode preffered between both major and minor.
          blended_audio_features["mode"] = 0;
        } else {
          blended_audio_features["mode"] = audio_features_from_time["mode"];
        }
        break;
    }
  
    for (const feature in audio_features_from_time) {
      if (feature === "key" || feature == "mode") continue;
      blended_audio_features[feature] = Number((
        (time_weight * audio_features_from_time[feature] +
          weather_weight * audio_features_from_weather[feature]) /
        (time_weight + weather_weight)).toFixed(4));  // Round to 4 decimal places
    }
  
    return blended_audio_features;
  };
  
export default getAudioFeatures;

    
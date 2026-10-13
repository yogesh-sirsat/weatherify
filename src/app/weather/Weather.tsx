"use client";

import { useEffect, useRef, useState, FC } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Alert from "@/components/Alert";
import manageAlerts from "@/utils/manageAlerts";
import { WeatherData, WeatherStatus, CitySuggestion } from "@/types/weather";

interface WeatherProps {
  setWeatherStatus: React.Dispatch<React.SetStateAction<WeatherStatus | null>>;
  weatherStatus: WeatherStatus | null;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

interface WeatherStatusMessage {
  head: string;
  body: string;
}

type CoordinatesInput =
  | GeolocationCoordinates
  | { latitude: number; longitude: number };

const Weather: FC<WeatherProps> = ({ setWeatherStatus, weatherStatus, setError }) => {
  const [modalError, setModalError] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [locationNotFound, setLocationNotFound] = useState(false);
  const [weatherData, setWeatherStatusData] = useState<WeatherData | null>(null);
  const [localTimeString, setLocalTimeString] = useState("");
  const [weatherStatusMessage, setWeatherStatusMessage] = useState<WeatherStatusMessage | null>(null);

  const cityModal = useRef<HTMLDialogElement>(null);

  // Debounce city suggestions query as user types
  useEffect(() => {
    const trimmed = cityInput.trim();
    if (!trimmed || trimmed.length < 2) {
      setCitySuggestions([]);
      setIsSearchingCity(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingCity(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const res = await axios.get<CitySuggestion[]>(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            trimmed
          )}&limit=5&appid=${apiKey}`
        );
        if (Array.isArray(res.data)) {
          setCitySuggestions(res.data);
        } else {
          setCitySuggestions([]);
        }
      } catch (err) {
        console.error("Error fetching city suggestions:", err);
        setCitySuggestions([]);
      } finally {
        setIsSearchingCity(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cityInput]);

  const managePostWeatherDataChange = (weather_main: string) => {
    setWeatherStatus((prev) => ({
      main: weather_main,
      time_period: prev?.time_period || "Midday",
    }));
    setLocationNotFound(false);
    cityModal.current?.close();
  };

  const fetchWeatherData = async (
    coordinates: CoordinatesInput | null,
    city?: string
  ) => {
    setError("");
    setModalError(null);

    const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
    let query: string;

    const retrieveCache = (key: string) => {
      if (weatherData && weatherData.city.toLowerCase() === city?.toLowerCase()) {
        managePostWeatherDataChange(weatherData.weather.main);
        return true;
      }
      const cached = Cookies.get(key);
      if (cached) {
        try {
          const data: WeatherData = JSON.parse(cached);
          managePostWeatherDataChange(data.weather.main);
          setWeatherStatusData(data);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    };

    if (coordinates) {
      const coords_key = JSON.stringify({
        lat: Number(coordinates.latitude.toFixed(2)),
        lon: Number(coordinates.longitude.toFixed(2)),
      });
      if (retrieveCache(coords_key)) return;
      query = `lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
    } else if (city) {
      if (retrieveCache(city.toLowerCase())) return;
      query = `q=${encodeURIComponent(city)}`;
    } else {
      return;
    }

    const url = `${baseUrl}${query}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`;
    try {
      const response = await axios.get(url);
      const data: WeatherData = {
        coord: response.data.coord,
        weather: response.data.weather[0],
        main: response.data.main,
        sys: response.data.sys,
        timezone: response.data.timezone,
        city: response.data.name,
        cod: response.data.cod,
      };

      // Descriptive weather naming for UI
      if (data.weather.id === 800) {
        data.weather.main = "Clear Sky";
      } else if (data.weather.id === 801 || data.weather.id === 802) {
        data.weather.main = "Partly Clouds";
      }

      const expires_at = new Date(Date.now() + 10 * 60 * 1000);
      Cookies.set(data.city.toLowerCase(), JSON.stringify(data), {
        expires: expires_at,
      });

      if (coordinates) {
        const coords_key = JSON.stringify({
          lat: Number(coordinates.latitude.toFixed(2)),
          lon: Number(coordinates.longitude.toFixed(2)),
        });
        Cookies.set(coords_key, JSON.stringify(data), { expires: expires_at });
      }

      setWeatherStatusData(data);
      managePostWeatherDataChange(data.weather.main);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setModalError("Provided location not found");
      } else {
        manageAlerts(
          setError,
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Error fetching weather data"
        );
      }
    }
  };

  const getCoordinates = () => {
    const savedCity =
      Cookies.get("last_city") ||
      (typeof window !== "undefined" ? localStorage.getItem("last_city") : null);

    if (savedCity) {
      fetchWeatherData(null, savedCity);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await fetchWeatherData(position.coords);
        },
        (error) => {
          setLocationNotFound(true);
          if (error.code === error.PERMISSION_DENIED) {
            console.warn(
              "Geolocation permission denied by user. Location input is available."
            );
          } else {
            console.warn("Geolocation unavailable:", error.message);
          }
        },
        { maximumAge: 900000, timeout: 8000 }
      );
    } else {
      setLocationNotFound(true);
    }
  };

  const getWeatherIconUrl = (icon_code?: string): string => {
    if (!icon_code) return "https://openweathermap.org/img/wn/01d@4x.png";
    return `https://openweathermap.org/img/wn/${icon_code}@4x.png`;
  };

  const manageWeatherStatus = (current_hours: number) => {
    let time_period: WeatherStatus["time_period"] = "Midday";
    let message: WeatherStatusMessage = { head: "", body: "" };

    if (current_hours >= 4 && current_hours < 6) {
      time_period = "Early Morning";
      message = {
        head: "Dawn's Delight",
        body: "Rise and shine! Early mornings bring a sense of freshness and optimism.",
      };
    } else if (current_hours >= 6 && current_hours < 8) {
      time_period = "Morning";
      message = {
        head: "Energizing Start",
        body: "Good morning! The day is in full swing, and you're filled with energy.",
      };
    } else if (current_hours >= 8 && current_hours < 10) {
      time_period = "Late Morning";
      message = {
        head: "Productive Flow",
        body: "You're in the zone! Late morning is perfect for focused work.",
      };
    } else if (current_hours >= 10 && current_hours < 12) {
      time_period = "Midday";
      message = {
        head: "Sunny Break",
        body: "It's midday, and the sun is shining bright. Take a break.",
      };
    } else if (current_hours >= 12 && current_hours < 14) {
      time_period = "Early Afternoon";
      message = {
        head: "Lunchtime Vibes",
        body: "Time for a delightful lunch! Refuel your body and spirits.",
      };
    } else if (current_hours >= 14 && current_hours < 16) {
      time_period = "Mid Afternoon";
      message = {
        head: "Focused Drive",
        body: "Stay on track! Mid-afternoon is ideal for concentration.",
      };
    } else if (current_hours >= 16 && current_hours < 18) {
      time_period = "Late Afternoon";
      message = {
        head: "Wind Down",
        body: "As the day winds down, take a moment to relax.",
      };
    } else if (current_hours >= 18 && current_hours < 20) {
      time_period = "Early Evening";
      message = {
        head: "Golden Hour",
        body: "Welcome to the early evening! The golden hour brings a warm feeling.",
      };
    } else if (current_hours >= 20 && current_hours < 22) {
      time_period = "Late Evening";
      message = {
        head: "Twilight Tranquility",
        body: "Twilight settles in, and the world takes on a tranquil vibe.",
      };
    } else if (current_hours >= 22 || current_hours < 4) {
      if (current_hours >= 22) {
        time_period = "Night";
        message = {
          head: "Nighttime Serenity",
          body: "As the night deepens, find serenity in its beauty.",
        };
      } else {
        time_period = "Late Night";
        message = {
          head: "Midnight Stillness",
          body: "It's the stillness of midnight. Perfect for rest.",
        };
      }
    }

    setWeatherStatus((prev) => ({
      main: prev?.main || "Clear Sky",
      time_period,
    }));
    setWeatherStatusMessage(message);
  };

  const manageLocalTime = (timezone?: number) => {
    let current_date: Date;
    let hours: number;
    let minutes: number;

    if (timezone !== undefined) {
      current_date = new Date(Date.now() + timezone * 1000);
      hours = current_date.getUTCHours();
      minutes = current_date.getUTCMinutes();
    } else {
      current_date = new Date();
      hours = current_date.getHours();
      minutes = current_date.getMinutes();
    }

    setLocalTimeString(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
    manageWeatherStatus(hours);
  };

  useEffect(() => {
    manageLocalTime(weatherData?.timezone);
    const interval = setInterval(
      () => manageLocalTime(weatherData?.timezone),
      60000
    );
    return () => clearInterval(interval);
  }, [weatherData]);

  useEffect(() => {
    getCoordinates();
  }, []);

  const handleSelectSuggestion = (suggestion: CitySuggestion) => {
    fetchWeatherData(
      { latitude: suggestion.lat, longitude: suggestion.lon },
      suggestion.name
    );
    setCityInput("");
    setCitySuggestions([]);
    setModalError(null);
    cityModal.current?.close();
  };

  const handleCityInput = () => {
    if (!cityInput.trim()) {
      setModalError("Input is empty");
      return;
    }
    if (citySuggestions.length > 0) {
      handleSelectSuggestion(citySuggestions[0]);
    } else {
      fetchWeatherData(null, cityInput.trim());
      setCityInput("");
      setCitySuggestions([]);
      cityModal.current?.close();
    }
  };

  return (
    <section className="flex flex-col lg:flex-row gap-1 md:gap-2 mt-14 md:mt-16 xl:mt-0">
      {locationNotFound ? (
        <Alert
          type="warning"
          message={
            "Location not found, please check if your location is enabled!"
          }
          relativeClasses="bg-warning alert-warning fixed items-center flex-col mt-16 mx-4"
        >
          <div>
            <span>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => cityModal.current?.showModal()}
              >
                Click here
              </button>{" "}
              to enter city manually.
            </span>
          </div>
        </Alert>
      ) : (
        <div className="stats stats-horizontal shadow-md mt-2 md:mt-0 bg-base-200 overflow-auto">
          <div className="stat pr-0 gap-1 pl-3 sm:pl-6">
            <div className="stat-figure">
              <div className="avatar">
                <div className="w-24 rounded-full bg-base-100 flex items-center justify-center">
                  {weatherData?.weather?.icon ? (
                    <Image
                      src={getWeatherIconUrl(weatherData.weather.icon)}
                      alt="weather_icon"
                      width={150}
                      height={150}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-base-300 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
            <div className="stat-title">
              {weatherData?.city}, {weatherData?.sys.country}{" "}
              <span>
                <button
                  className="badge badge-xs py-2 badge-outline hover:badge-ghost"
                  onClick={() => cityModal.current?.showModal()}
                >
                  Change
                </button>
              </span>
            </div>
            <div className="stat-value">{weatherData?.weather.main}</div>
            <div className="stat-desc whitespace-normal">
              {weatherData?.weather.description}
            </div>
          </div>

          <div className="stat border-none">
            <div className="stat-title">Feels Like</div>
            <div className="stat-value">{weatherData?.main.feels_like}º</div>
            <div className="stat-desc">Temps {weatherData?.main.temp}º</div>
          </div>

          <div className="stat border-none">
            <div className="stat-title">Humidity</div>
            <div className="stat-value">{weatherData?.main.humidity}%</div>
            <div className="stat-desc">
              Pressure {weatherData?.main.pressure}
            </div>
          </div>
        </div>
      )}
      <div className="stats stats-horizontal shadow-md bg-base-200">
        <div className="stat pl-3 sm:pl-6">
          <div className="stat-title">
            {localTimeString} - {weatherStatus?.time_period}
          </div>
          <div className="stat-value">{weatherStatusMessage?.head}</div>
          <div className="stat-desc whitespace-pre-line mt-2 break-words">
            {weatherStatusMessage?.body}
          </div>
        </div>
      </div>
      <dialog
        ref={cityModal}
        className="modal shadow-xl backdrop-blur-sm bg-base-200 bg-opacity-10"
      >
        <div className="modal-box max-w-md">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                setCitySuggestions([]);
                setCityInput("");
                setModalError(null);
              }}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Set Location Manually</h3>
          <p className="p-3 mt-2 text-xs md:text-sm bg-info/20 text-info-content border border-info/30 rounded-xl">
            Type your city name to see instant location suggestions with coordinates.
          </p>
          {modalError && (
            <div className="bg-error text-error-content flex flex-row gap-2 mt-2 rounded-lg p-2 text-sm items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{modalError}</span>
            </div>
          )}
          <div className="form-control w-full mt-3">
            <label className="label py-1">
              <span className="label-text font-medium">Search City</span>
              {isSearchingCity && (
                <span className="label-text-alt flex items-center gap-1 text-primary">
                  <span className="loading loading-spinner loading-xs"></span>{" "}
                  searching...
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. London, Tokyo, New York"
                className="input input-bordered input-sm md:input-md w-full"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCityInput();
                  }
                }}
              />
            </div>

            {/* Suggestions dropdown */}
            {citySuggestions.length > 0 && (
              <div className="mt-2 border border-base-300 rounded-xl overflow-hidden shadow-lg bg-base-100 max-h-52 overflow-y-auto">
                <ul className="menu p-1 w-full">
                  {citySuggestions.map((item, idx) => (
                    <li key={`${item.lat}-${item.lon}-${idx}`}>
                      <button
                        type="button"
                        className="flex items-center justify-between py-2 px-3 hover:bg-primary hover:text-primary-content transition-colors rounded-lg text-left"
                        onClick={() => handleSelectSuggestion(item)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 shrink-0 text-accent"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <div className="truncate">
                            <span className="font-semibold">{item.name}</span>
                            {item.state ? (
                              <span className="opacity-75 text-xs">
                                , {item.state}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="badge badge-sm badge-outline font-mono">
                            {item.country}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cityInput.trim().length >= 2 &&
              !isSearchingCity &&
              citySuggestions.length === 0 && (
                <div className="text-xs text-base-content/60 mt-2 px-1">
                  No matching cities found. You can click Submit to search by
                  city name.
                </div>
              )}
          </div>
          <div className="modal-action mt-4">
            <button
              className="btn btn-sm btn-primary md:btn-md"
              onClick={handleCityInput}
            >
              Submit
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default Weather;

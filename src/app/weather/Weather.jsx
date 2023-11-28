"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Alert from "@/components/Alert";
import manageAlerts from "@/utils/manageAlerts";

function Weather({ setWeatherStatus, weatherStatus, setError }) {
  const [modalError, setModalError] = useState(null);
  const [cityInput, setCityInput] = useState("");
  const [locationNotFound, setLocationNotFound] = useState(false);
  const [weatherData, setWeatherStatusData] = useState(null);
  const [localTimeString, setLocalTimeString] = useState("");
  const [weatherStatusMessage, setWeatherStatusMessage] = useState(null);

  const cityModal = useRef(null);

  const managePostWeatherDataChange = (weather_main) => {
    setWeatherStatus((prev) => ({
      ...prev,
      main: weather_main,
    }));
    setLocationNotFound(false);
    cityModal.current.close();
  };

  const fetchWeatherData = async (coordinates, city) => {
    setError(null);
    setModalError(null);

    const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
    let query;
    const retriveCache = (key) => {
      if (weatherData && weatherData.city === city) {
        managePostWeatherDataChange(weatherData.weather.main);
        return;
      }
      const data = JSON.parse(Cookies.get(key));
      managePostWeatherDataChange(data.weather.main);
      setWeatherStatusData(data);
    };

    if (coordinates) {
      const coords_key = JSON.stringify(coordinates);
      if (Cookies.get(coords_key)) {
        retriveCache(coords_key);
        return;
      }
      query = `lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
    } else {
      if (Cookies.get(city.toLowerCase())) {
        retriveCache(city.toLowerCase());
        return;
      }
      query = `q=${city}`;
    }

    const url = `${baseUrl}${query}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`;
    try {
      const response = await axios.get(url);
      console.log(response.data);
      const main = response.data.main;
      delete main.sea_level;
      delete main.grnd_level;
      main.temp = Math.round(main.temp);
      main.feels_like = Math.round(main.feels_like);
      const data = {
        coord: response.data.coord,
        weather: response.data.weather[0],
        main: response.data.main,
        sys: response.data.sys,
        timezone: response.data.timezone,
        city: response.data.name,
        cod: response.data.cod,
      };
      // More descriptive weather main
      if (data.weather.id === 800) {
        data.weather.main = "Clear Sky";
      } else if (main.id === 801 || main.id === 802) {
        data.weather.main = "Partly Clouds";
      }
      // Cache weather data of same location for 10 minutes
      const expires_at = new Date(Date.now() + 10 * 60 * 1000);
      // Cache save key as city
      Cookies.set(data.city.toLowerCase(), JSON.stringify(data), {
        expires: expires_at,
      });

      // Cache Set key as coordinates
      Cookies.set(JSON.stringify(coordinates), JSON.stringify(data), {
        expires: expires_at,
      });
      setWeatherStatusData(data);
      managePostWeatherDataChange(data.weather.main);
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 404) {
          setModalError("Provided location not found");
        } else {
          manageAlerts(setError, error.response.data?.error);
          console.log(error);
        }
      } else {
        manageAlerts(setError, "Error fetching weather data");
        console.log(error);
      }
    }
  };

  const getWeather = async () => {
    try {
      await getCoordinates();
    } catch (error) {
      console.log(error);
    }
  };

  const getCoordinates = async () => {
    // debugger;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Handle successful location retrieval
          const coordinates = position.coords;
          console.log(
            `coordinates: ${coordinates.latitude}, ${coordinates.longitude}`
          );
          await fetchWeatherData(coordinates);
        },
        async (error) => {
          setLocationNotFound(true);
          // Handle location retrieval error
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log("User denied the request for geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.log("The request to get user location timed out.");
              break;
            default:
              console.log(`An unknown error occurred: ${error.message}`);
          }
        },
        {
          maximumAge: 900000,
        }
      );
    } else {
      setLocationNotFound(true);
    }
  };

  const getWeatherIconUrl = (icon_code) => {
    if (!icon_code) {
      return;
    }
    const base_url = "http://openweathermap.org/img/wn/";
    return `${base_url}${icon_code}@4x.png`;
  };

  const manageWeatherStatus = (current_hours) => {
    console.log("manageweatherMessage");
    switch (true) {
      case 4 <= current_hours && current_hours < 6:
        setWeatherStatus((prev) => ({
          ...prev,
          time_period: "Early Morning",
        }));
        setWeatherStatusMessage({
          head: "Dawn's Delight",
          body: "Rise and shine! Early mornings bring a sense of freshness and optimism. It's a time for quiet reflection and the promise of a new day.",
        });
        break;
      case 6 <= current_hours && current_hours < 8:
        setWeatherStatus((prev) => ({
          ...prev,
          time_period: "Morning",
        }));
        setWeatherStatusMessage({
          head: "Energizing Start",
          body: "Good morning! The day is in full swing, and you're filled with energy and enthusiasm. Get ready to seize the day!",
        });
        break;
      case 8 <= current_hours && current_hours < 10:
        setWeatherStatus((prev) => ({ ...prev, time_period: "Late Morning" }));
        setWeatherStatusMessage({
          head: "Productive Flow",
          body: "You're in the zone! Late morning is perfect for focused work and productivity. Keep the momentum going.",
        });
        break;
      case 10 <= current_hours && current_hours < 12:
        setWeatherStatus((prev) => ({
          ...prev,
          time_period: "Midday",
        }));
        setWeatherStatusMessage({
          head: "Sunny Break",
          body: "It's midday, and the sun is shining bright. Take a break, soak in the positivity, and recharge for the afternoon.",
        });
        break;
      case 12 <= current_hours && current_hours < 14:
        setWeatherStatus((prev) => ({
          ...prev,
          time_period: "Early Afternoon",
        }));
        setWeatherStatusMessage({
          head: "Lunchtime Vibes",
          body: "Time for a delightful lunch! Early afternoon is a great time to refuel, both your body and your spirits.",
        });
        break;
      case 14 <= current_hours && current_hours < 16:
        setWeatherStatus((prev) => ({
          ...prev,
          time_period: "Mid Afternoon",
        }));
        setWeatherStatusMessage({
          head: "Focused Drive",
          body: "Stay on track! Mid-afternoon is ideal for tasks that require concentration and determination.",
        });
        break;
      case 16 <= current_hours && current_hours < 18:
        setWeatherStatus((prev) => ({
          ...prev,
          time_period: "Late Afternoon",
        }));
        setWeatherStatusMessage({
          head: "Wind Down",
          body: "As the day winds down, take a moment to relax. Late afternoon is a transition into a more relaxed state.",
        });
        break;
      case 18 <= current_hours && current_hours < 20:
        setWeatherStatus((prev) => ({
          ...prev,
          time_period: "Early Evening",
        }));
        setWeatherStatusMessage({
          head: "Golden Hour",
          body: "Welcome to the early evening! The golden hour brings a warm, cozy feeling. It's a great time for unwinding and spending time with loved ones.",
        });
        break;
      case 20 <= current_hours && current_hours < 22:
        setWeatherStatus((prev) => ({
          ...prev,
          time_period: "Late Evening",
        }));
        setWeatherStatusMessage({
          head: "Twilight Tranquility",
          body: "Twilight settles in, and the world takes on a tranquil vibe. Late evening is perfect for winding down and enjoying quiet moments.",
        });
        break;
      case 22 <= current_hours && current_hours < 24:
        setWeatherStatus((prev) => ({
          ...prev,
          time_period: "Night",
        }));
        setWeatherStatusMessage({
          head: "Nighttime Serenity",
          body: "As the night deepens, find serenity in its beauty. Nighttime is perfect for calm and introspection.",
        });
        break;
      case 0 <= current_hours && current_hours < 4:
        setWeatherStatus((prev) => ({
          ...prev,
          time_period: "Late Night",
        }));
        setWeatherStatusMessage({
          head: "Midnight Stillness",
          body: "It's the stillness of midnight. Late night is for rest, dreams, and quiet contemplation.",
        });
        break;
      default:
        setWeatherStatusMessage("How is the day?");
        break;
    }
  };

  function manageLocalTime(timezone) {
    console.log("second cho");
    let current_date, hours, minutes;
    console.log(timezone);
    if (timezone) {
      console.log("timezone is available");
      current_date = new Date(Date.now() + timezone * 1000);
      hours = current_date.getUTCHours();
      minutes = current_date.getUTCMinutes();
    } else {
      current_date = new Date();
      hours = current_date.getHours();
      minutes = current_date.getMinutes();
    }
    // Force to 2 digits, if its single digit start with 0
    setLocalTimeString(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
    manageWeatherStatus(hours);
  }

  useEffect(() => {
    manageLocalTime(weatherData?.timezone);
    const local_time_interval = setInterval(() => {
      manageLocalTime(weatherData?.timezone);
    }, 60000);
    return () => {
      clearInterval(local_time_interval);
    };
  }, [weatherData]);

  useEffect(() => {
    getWeather();
  }, []);

  const handleCityInput = () => {
    if (cityInput.trim() === "") {
      setModalError("Input is empty");
    } else {
      fetchWeatherData(null, cityInput);
    }
    setCityInput("");
  };

  return (
    <section className="flex flex-col lg:flex-row gap-1 md:gap-2 mt-14 md:mt-16 xl:mt-0">
      {locationNotFound ? (
        <Alert type="warning" message={"Location not found, please check if your location is enabled!"} relativeClasses="bg-warning alert-warning fixed items-center flex-col mt-16 mx-4">         
          <div>
            <span>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => cityModal.current.show()}
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
                <div className="w-24 rounded-full bg-base-100">
                  <Image
                    src={getWeatherIconUrl(weatherData?.weather.icon)}
                    alt="weather_icon"
                    width={150}
                    height={150}
                  />
                </div>
              </div>
            </div>
            <div className="stat-title">
              {weatherData?.city}, {weatherData?.sys.country}{" "}
              <span>
                <button
                  className="badge badge-xs py-2 badge-outline hover:badge-ghost"
                  onClick={() => cityModal.current.show()}
                >
                  Change
                </button>
              </span>
            </div>
            <div className="stat-value">{weatherData?.weather.main}</div>
            <div className="stat-desc whitespace-normal">{weatherData?.weather.description}</div>
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
        id="change-location-modal"
        ref={cityModal}
        className="modal shadow-xl backdrop-blur-sm bg-base-200 bg-opacity-10"
      >
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Set Location Manually</h3>
          <p className="p-4 mt-2 text-sm bg-info rounded-xl italic text-gray-900">
            May be your device&apos;s location is disabled, or if your internet
            service provider routes your connection through servers in a
            different location, but don&apos;t worry I got you covered.
          </p>
          {modalError ? (
            <div className="bg-error flex flex-row gap-2 mt-2 rounded-lg p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>{modalError}</span>
            </div>
          ) : null}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Enter name of your city</span>
            </label>
            <input
              id="city-input"
              type="text"
              placeholder="Type here"
              className="input input-bordered input-sm md:input-md"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
            />
          </div>
          <div className="modal-action">
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
}

export default Weather;

"use client";

import { useEffect, useRef, useState, FC } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Alert from "@/components/Alert";
import manageAlerts from "@/utils/manageAlerts";
import { WeatherData, WeatherStatus } from "@/types/weather";

interface WeatherProps {
  setWeatherStatus: React.Dispatch<React.SetStateAction<WeatherStatus | null>>;
  weatherStatus: WeatherStatus | null;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

interface WeatherStatusMessage {
  head: string;
  body: string;
}

const Weather: FC<WeatherProps> = ({ setWeatherStatus, weatherStatus, setError }) => {
  const [modalError, setModalError] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState("");
  const [locationNotFound, setLocationNotFound] = useState(false);
  const [weatherData, setWeatherStatusData] = useState<WeatherData | null>(null);
  const [localTimeString, setLocalTimeString] = useState("");
  const [weatherStatusMessage, setWeatherStatusMessage] = useState<WeatherStatusMessage | null>(null);

  const cityModal = useRef<HTMLDialogElement>(null);

  const managePostWeatherDataChange = (weather_main: string) => {
    setWeatherStatus((prev) => ({
      main: weather_main,
      time_period: prev?.time_period || "Midday",
    }));
    setLocationNotFound(false);
    cityModal.current?.close();
  };

  const fetchWeatherData = async (coordinates: GeolocationCoordinates | null, city?: string) => {
    setError("");
    setModalError(null);

    const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
    let query: string;
    
    const retrieveCache = (key: string) => {
      if (weatherData && weatherData.city === city) {
        managePostWeatherDataChange(weatherData.weather.main);
        return true;
      }
      const cached = Cookies.get(key);
      if (cached) {
        const data: WeatherData = JSON.parse(cached);
        managePostWeatherDataChange(data.weather.main);
        setWeatherStatusData(data);
        return true;
      }
      return false;
    };

    if (coordinates) {
      const coords_key = JSON.stringify({ lat: coordinates.latitude, lon: coordinates.longitude });
      if (retrieveCache(coords_key)) return;
      query = `lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
    } else if (city) {
      if (retrieveCache(city.toLowerCase())) return;
      query = `q=${city}`;
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

      // More descriptive weather main
      if (data.weather.id === 800) {
        data.weather.main = "Clear Sky";
      } else if (data.weather.id === 801 || data.weather.id === 802) {
        data.weather.main = "Partly Clouds";
      }

      const expires_at = new Date(Date.now() + 10 * 60 * 1000);
      Cookies.set(data.city.toLowerCase(), JSON.stringify(data), { expires: expires_at });
      
      if (coordinates) {
        const coords_key = JSON.stringify({ lat: coordinates.latitude, lon: coordinates.longitude });
        Cookies.set(coords_key, JSON.stringify(data), { expires: expires_at });
      }

      setWeatherStatusData(data);
      managePostWeatherDataChange(data.weather.main);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setModalError("Provided location not found");
      } else {
        manageAlerts(setError, error.response?.data?.error || "Error fetching weather data");
      }
    }
  };

  const getCoordinates = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await fetchWeatherData(position.coords);
        },
        (error) => {
          setLocationNotFound(true);
          console.error("Geolocation error:", error.message);
        },
        { maximumAge: 900000 }
      );
    } else {
      setLocationNotFound(true);
    }
  };

  const getWeatherIconUrl = (icon_code?: string) => {
    if (!icon_code) return "";
    return `http://openweathermap.org/img/wn/${icon_code}@4x.png`;
  };

  const manageWeatherStatus = (current_hours: number) => {
    let time_period: WeatherStatus["time_period"] = "Midday";
    let message: WeatherStatusMessage = { head: "", body: "" };

    if (current_hours >= 4 && current_hours < 6) {
      time_period = "Early Morning";
      message = { head: "Dawn's Delight", body: "Rise and shine! Early mornings bring a sense of freshness and optimism." };
    } else if (current_hours >= 6 && current_hours < 8) {
      time_period = "Morning";
      message = { head: "Energizing Start", body: "Good morning! The day is in full swing, and you're filled with energy." };
    } else if (current_hours >= 8 && current_hours < 10) {
      time_period = "Late Morning";
      message = { head: "Productive Flow", body: "You're in the zone! Late morning is perfect for focused work." };
    } else if (current_hours >= 10 && current_hours < 12) {
      time_period = "Midday";
      message = { head: "Sunny Break", body: "It's midday, and the sun is shining bright. Take a break." };
    } else if (current_hours >= 12 && current_hours < 14) {
      time_period = "Early Afternoon";
      message = { head: "Lunchtime Vibes", body: "Time for a delightful lunch! Refuel your body and spirits." };
    } else if (current_hours >= 14 && current_hours < 16) {
      time_period = "Mid Afternoon";
      message = { head: "Focused Drive", body: "Stay on track! Mid-afternoon is ideal for concentration." };
    } else if (current_hours >= 16 && current_hours < 18) {
      time_period = "Late Afternoon";
      message = { head: "Wind Down", body: "As the day winds down, take a moment to relax." };
    } else if (current_hours >= 18 && current_hours < 20) {
      time_period = "Early Evening";
      message = { head: "Golden Hour", body: "Welcome to the early evening! The golden hour brings a warm feeling." };
    } else if (current_hours >= 20 && current_hours < 22) {
      time_period = "Late Evening";
      message = { head: "Twilight Tranquility", body: "Twilight settles in, and the world takes on a tranquil vibe." };
    } else if (current_hours >= 22 || current_hours < 4) {
      if (current_hours >= 22) {
        time_period = "Night";
        message = { head: "Nighttime Serenity", body: "As the night deepens, find serenity in its beauty." };
      } else {
        time_period = "Late Night";
        message = { head: "Midnight Stillness", body: "It's the stillness of midnight. Perfect for rest." };
      }
    }

    setWeatherStatus((prev) => ({
      main: prev?.main || "Clear",
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

    setLocalTimeString(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
    manageWeatherStatus(hours);
  };

  useEffect(() => {
    manageLocalTime(weatherData?.timezone);
    const interval = setInterval(() => manageLocalTime(weatherData?.timezone), 60000);
    return () => clearInterval(interval);
  }, [weatherData]);

  useEffect(() => {
    getCoordinates();
  }, []);

  const handleCityInput = () => {
    if (!cityInput.trim()) {
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
              <button className="btn btn-sm btn-primary" onClick={() => cityModal.current?.showModal()}>Click here</button> to enter city manually.
            </span>
          </div>
        </Alert>
      ) : (
        <div className="stats stats-horizontal shadow-md mt-2 md:mt-0 bg-base-200 overflow-auto">
          <div className="stat pr-0 gap-1 pl-3 sm:pl-6">
            <div className="stat-figure">
              <div className="avatar">
                <div className="w-24 rounded-full bg-base-100">
                  <Image src={getWeatherIconUrl(weatherData?.weather.icon)} alt="weather_icon" width={150} height={150} />
                </div>
              </div>
            </div>
            <div className="stat-title">
              {weatherData?.city}, {weatherData?.sys.country}{" "}
              <span>
                <button className="badge badge-xs py-2 badge-outline hover:badge-ghost" onClick={() => cityModal.current?.showModal()}>Change</button>
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
            <div className="stat-desc">Pressure {weatherData?.main.pressure}</div>
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
      <dialog ref={cityModal} className="modal shadow-xl backdrop-blur-sm bg-base-200 bg-opacity-10">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Set Location Manually</h3>
          <p className="p-4 mt-2 text-sm bg-info rounded-xl italic text-gray-900">
            Maybe your device&apos;s location is disabled, or your ISP routes your connection elsewhere. Don&apos;t worry, I got you covered.
          </p>
          {modalError && (
            <div className="bg-error flex flex-row gap-2 mt-2 rounded-lg p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{modalError}</span>
            </div>
          )}
          <div className="form-control w-full">
            <label className="label"><span className="label-text">Enter name of your city</span></label>
            <input type="text" placeholder="Type here" className="input input-bordered input-sm md:input-md" value={cityInput} onChange={(e) => setCityInput(e.target.value)} />
          </div>
          <div className="modal-action">
            <button className="btn btn-sm btn-primary md:btn-md" onClick={handleCityInput}>Submit</button>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default Weather;

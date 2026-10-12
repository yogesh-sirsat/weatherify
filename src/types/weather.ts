export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min?: number;
    temp_max?: number;
    pressure: number;
    humidity: number;
  };
  sys: {
    country: string;
    sunrise?: number;
    sunset?: number;
  };
  timezone: number;
  city: string;
  cod: number;
}

export type TimePeriod =
  | "Early Morning"
  | "Morning"
  | "Late Morning"
  | "Midday"
  | "Early Afternoon"
  | "Mid Afternoon"
  | "Late Afternoon"
  | "Early Evening"
  | "Late Evening"
  | "Night"
  | "Late Night";

export interface WeatherStatus {
  main: string;
  time_period: TimePeriod;
}

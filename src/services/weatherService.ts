import { getWeatherCode } from "@/lib/weatherCodes";

const LATITUDE = -6.921971;
const LONGITUDE = 109.125399;

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weather: string;
  icon: string;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  weather: string;
  icon: string;
  maxTemp: number;
  minTemp: number;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };

  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };

  error?: boolean;
  reason?: string;
}

export async function getWeather(): Promise<WeatherData | null> {
  const params = new URLSearchParams({
    latitude: String(LATITUDE),
    longitude: String(LONGITUDE),
    current:
      "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "Asia/Jakarta",
    forecast_days: "7",
  });

  const url =
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: {
        revalidate: 1800,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data =
      (await response.json()) as OpenMeteoResponse;

    if (
      data.error ||
      !data.current ||
      !data.daily
    ) {
      return null;
    }

    const currentTemperature =
      data.current.temperature_2m;

    const currentHumidity =
      data.current.relative_humidity_2m;

    const currentWindSpeed =
      data.current.wind_speed_10m;

    const currentWeatherCode =
      data.current.weather_code;

    if (
      currentTemperature === undefined ||
      currentHumidity === undefined ||
      currentWindSpeed === undefined ||
      currentWeatherCode === undefined
    ) {
      return null;
    }

    const dates = data.daily.time ?? [];
    const weatherCodes =
      data.daily.weather_code ?? [];
    const maxTemps =
      data.daily.temperature_2m_max ?? [];
    const minTemps =
      data.daily.temperature_2m_min ?? [];

    const currentInfo =
      getWeatherCode(currentWeatherCode);

    const forecast: DailyForecast[] =
      dates.map((date, index) => {
        const weatherCode =
          weatherCodes[index] ?? 0;

        const info =
          getWeatherCode(weatherCode);

        return {
          date,
          weatherCode,
          weather: info.label,
          icon: info.icon,
          maxTemp: maxTemps[index] ?? 0,
          minTemp: minTemps[index] ?? 0,
        };
      });

    return {
      current: {
        temperature: currentTemperature,
        humidity: currentHumidity,
        windSpeed: currentWindSpeed,
        weatherCode: currentWeatherCode,
        weather: currentInfo.label,
        icon: currentInfo.icon,
      },

      forecast,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Sun,
  Wind,
  CloudFog,
  CloudLightning,
  Snowflake,
  Cloudy,
} from "lucide-react";

import { getWeather } from "@/services/weatherService";

function WeatherIcon({
  weatherCode,
  className = "h-14 w-14",
}: {
  weatherCode: number;
  className?: string;
}) {
  if (weatherCode === 0) {
    return <Sun className={className} />;
  }

  if (weatherCode === 1 || weatherCode === 2) {
    return <CloudSun className={className} />;
  }

  if (weatherCode === 3) {
    return <Cloud className={className} />;
  }

  if (
    weatherCode === 45 ||
    weatherCode === 48
  ) {
    return <CloudFog className={className} />;
  }

  if (
    weatherCode === 51 ||
    weatherCode === 53 ||
    weatherCode === 55 ||
    weatherCode === 56 ||
    weatherCode === 57
  ) {
    return <CloudRain className={className} />;
  }

  if (
    weatherCode === 61 ||
    weatherCode === 63 ||
    weatherCode === 65 ||
    weatherCode === 66 ||
    weatherCode === 67
  ) {
    return <CloudRain className={className} />;
  }

  if (
    weatherCode === 71 ||
    weatherCode === 73 ||
    weatherCode === 75 ||
    weatherCode === 77
  ) {
    return <Snowflake className={className} />;
  }

  if (
    weatherCode === 80 ||
    weatherCode === 81 ||
    weatherCode === 82
  ) {
    return <CloudRain className={className} />;
  }

  if (
    weatherCode === 95 ||
    weatherCode === 96 ||
    weatherCode === 99
  ) {
    return (
      <CloudLightning
        className={className}
      />
    );
  }

  return <Cloudy className={className} />;
}

export default async function WeatherCard() {
  const weather = await getWeather();

  if (!weather) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <CloudSun className="h-6 w-6 text-cyan-400" />

          Cuaca
        </h2>

        <p className="mt-6 text-slate-400">
          Gagal mengambil data cuaca.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <CloudSun className="h-6 w-6 text-cyan-400" />

          Cuaca Hari Ini
        </h2>

        <span className="text-sm text-slate-400">
          SMKN 1 Adiwerna
        </span>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="text-cyan-400">
          <WeatherIcon
            weatherCode={
              weather.current.weatherCode
            }
            className="h-16 w-16"
          />
        </div>

        <div>
          <h3 className="text-4xl font-bold">
            {Math.round(
              weather.current.temperature
            )}
            °C
          </h3>

          <p className="text-slate-300">
            {weather.current.weather}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-400">
            <Droplets className="h-4 w-4 text-cyan-400" />
            Kelembapan
          </p>

          <p className="mt-1 text-lg font-semibold">
            {weather.current.humidity}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-400">
            <Wind className="h-4 w-4 text-cyan-400" />
            Kecepatan Angin
          </p>

          <p className="mt-1 text-lg font-semibold">
            {weather.current.windSpeed} km/jam
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
          <Cloud className="h-5 w-5 text-cyan-400" />
          Prediksi 7 Hari
        </h3>

        <div className="space-y-3">
          {weather.forecast.map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="text-cyan-400">
                  <WeatherIcon
                    weatherCode={day.weatherCode}
                    className="h-7 w-7"
                  />
                </div>

                <div>
                  <p className="font-medium">
                    {new Date(
                      day.date
                    ).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                      }
                    )}
                  </p>

                  <p className="text-sm text-slate-400">
                    {day.weather}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {Math.round(day.maxTemp)}°
                </p>

                <p className="text-sm text-slate-400">
                  {Math.round(day.minTemp)}°
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
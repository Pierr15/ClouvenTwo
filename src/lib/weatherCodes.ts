export interface WeatherCode {
  label: string;
  icon: string;
}

export const weatherCodes: Record<number, WeatherCode> = {
  0: { label: "Cerah", icon: "☀️" },

  1: { label: "Sebagian Cerah", icon: "🌤️" },
  2: { label: "Berawan Sebagian", icon: "⛅" },
  3: { label: "Berawan", icon: "☁️" },

  45: { label: "Berkabut", icon: "🌫️" },
  48: { label: "Kabut Beku", icon: "🌫️" },

  51: { label: "Gerimis Ringan", icon: "🌦️" },
  53: { label: "Gerimis", icon: "🌦️" },
  55: { label: "Gerimis Lebat", icon: "🌧️" },

  61: { label: "Hujan Ringan", icon: "🌦️" },
  63: { label: "Hujan", icon: "🌧️" },
  65: { label: "Hujan Lebat", icon: "🌧️" },

  71: { label: "Salju Ringan", icon: "❄️" },
  73: { label: "Salju", icon: "❄️" },
  75: { label: "Salju Lebat", icon: "❄️" },

  80: { label: "Hujan Lokal", icon: "🌦️" },
  81: { label: "Hujan Lokal", icon: "🌧️" },
  82: { label: "Hujan Sangat Lebat", icon: "⛈️" },

  95: { label: "Badai Petir", icon: "⛈️" },
  96: { label: "Badai + Hujan Es", icon: "⛈️" },
  99: { label: "Badai Hebat", icon: "⛈️" }
};

export function getWeatherCode(code: number) {
  return (
    weatherCodes[code] ?? {
      label: "Tidak Diketahui",
      icon: "❓"
    }
  );
}
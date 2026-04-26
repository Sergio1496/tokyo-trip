import type { APIRoute } from "astro";

export const prerender = false;

const TOKYO_LAT = 35.6762;
const TOKYO_LON = 139.6503;
const TRIP_START = "2026-05-03";
const TRIP_END = "2026-05-16";

// WMO weather codes to description and emoji
const weatherCodes: Record<number, { desc: string; emoji: string }> = {
  0: { desc: "Despejado", emoji: "☀️" },
  1: { desc: "Mayormente despejado", emoji: "🌤️" },
  2: { desc: "Parcialmente nublado", emoji: "⛅" },
  3: { desc: "Nublado", emoji: "☁️" },
  45: { desc: "Niebla", emoji: "🌫️" },
  48: { desc: "Niebla helada", emoji: "🌫️" },
  51: { desc: "Llovizna ligera", emoji: "🌦️" },
  53: { desc: "Llovizna", emoji: "🌦️" },
  55: { desc: "Llovizna intensa", emoji: "🌧️" },
  61: { desc: "Lluvia ligera", emoji: "🌧️" },
  63: { desc: "Lluvia moderada", emoji: "🌧️" },
  65: { desc: "Lluvia fuerte", emoji: "🌧️" },
  80: { desc: "Chubascos ligeros", emoji: "🌦️" },
  81: { desc: "Chubascos", emoji: "🌧️" },
  82: { desc: "Chubascos fuertes", emoji: "⛈️" },
  95: { desc: "Tormenta", emoji: "⛈️" },
  96: { desc: "Tormenta con granizo", emoji: "⛈️" },
  99: { desc: "Tormenta fuerte con granizo", emoji: "⛈️" },
};

function getWeatherInfo(code: number) {
  return weatherCodes[code] || { desc: "Desconocido", emoji: "❓" };
}

type DayInfo = {
  date: string;
  dayNumber: number;
  tempMax: number;
  tempMin: number;
  rain: number;
  rainProb: number | null;
  code: number;
  description: string;
  emoji: string;
  source: "forecast" | "historical";
};

function toISODate(d: Date) {
  return d.toISOString().split("T")[0];
}

async function fetchForecast(startStr: string, endStr: string) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${TOKYO_LAT}&longitude=${TOKYO_LON}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code&timezone=Asia/Tokyo&start_date=${startStr}&end_date=${endStr}`;
  const res = await fetch(url);
  return res.json();
}

async function fetchHistorical(startStr: string, endStr: string) {
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${TOKYO_LAT}&longitude=${TOKYO_LON}&start_date=${startStr}&end_date=${endStr}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Asia/Tokyo`;
  const res = await fetch(url);
  return res.json();
}

export const GET: APIRoute = async () => {
  try {
    const now = new Date();
    const tripStart = new Date(TRIP_START);
    const tripEnd = new Date(TRIP_END);
    const daysUntilTrip = Math.floor((tripStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Open-Meteo allows forecast up to ~15 days ahead. Use 14 as a safe upper bound.
    const forecastMaxEnd = new Date(now);
    forecastMaxEnd.setDate(forecastMaxEnd.getDate() + 14);

    const forecastStart = tripStart > now ? tripStart : now;
    const forecastEnd = tripEnd < forecastMaxEnd ? tripEnd : forecastMaxEnd;
    const hasForecastWindow = forecastEnd >= forecastStart && forecastEnd >= tripStart;

    const dayMap = new Map<string, DayInfo>();
    let dayNumber = 1;

    const tripDays: string[] = [];
    for (let d = new Date(tripStart); d <= tripEnd; d.setDate(d.getDate() + 1)) {
      tripDays.push(toISODate(d));
    }

    // 1) Forecast for the window we can actually request
    if (hasForecastWindow) {
      const fStart = toISODate(forecastStart);
      const fEnd = toISODate(forecastEnd);
      const fData = await fetchForecast(fStart, fEnd);
      if (fData.daily) {
        fData.daily.time.forEach((date: string, i: number) => {
          const code = fData.daily.weather_code[i];
          const info = getWeatherInfo(code);
          dayMap.set(date, {
            date,
            dayNumber: 0,
            tempMax: fData.daily.temperature_2m_max[i],
            tempMin: fData.daily.temperature_2m_min[i],
            rain: fData.daily.precipitation_sum[i],
            rainProb: fData.daily.precipitation_probability_max?.[i] ?? null,
            code,
            description: info.desc,
            emoji: info.emoji,
            source: "forecast",
          });
        });
      }
    }

    // 2) Historical (last year) for any trip day not covered by forecast
    const missing = tripDays.filter((d) => !dayMap.has(d));
    if (missing.length > 0) {
      const lastYearStart = new Date(tripStart);
      lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
      const lastYearEnd = new Date(tripEnd);
      lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
      const hData = await fetchHistorical(toISODate(lastYearStart), toISODate(lastYearEnd));
      if (hData.daily) {
        hData.daily.time.forEach((date: string, i: number) => {
          const mapped = date.replace(/^\d{4}/, String(tripStart.getFullYear()));
          if (dayMap.has(mapped)) return;
          const code = hData.daily.weather_code[i];
          const info = getWeatherInfo(code);
          dayMap.set(mapped, {
            date: mapped,
            dayNumber: 0,
            tempMax: hData.daily.temperature_2m_max[i],
            tempMin: hData.daily.temperature_2m_min[i],
            rain: hData.daily.precipitation_sum[i],
            rainProb: null,
            code,
            description: info.desc,
            emoji: info.emoji,
            source: "historical",
          });
        });
      }
    }

    const days = tripDays
      .map((d) => dayMap.get(d))
      .filter((x): x is DayInfo => Boolean(x))
      .map((d) => ({ ...d, dayNumber: dayNumber++ }));

    if (days.length === 0) {
      return new Response(JSON.stringify({ error: "No weather data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sources = new Set(days.map((d) => d.source));
    const source = sources.size === 1 ? [...sources][0] : "mixed";

    return new Response(JSON.stringify({ source, daysUntilTrip, days }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

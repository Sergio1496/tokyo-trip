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

export const GET: APIRoute = async () => {
  try {
    const now = new Date();
    const tripStart = new Date(TRIP_START);
    const daysUntilTrip = Math.floor((tripStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let data;
    let source: string;

    if (daysUntilTrip <= 14 && daysUntilTrip >= -14) {
      // Real forecast available
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${TOKYO_LAT}&longitude=${TOKYO_LON}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code&timezone=Asia/Tokyo&start_date=${TRIP_START}&end_date=${TRIP_END}`;
      const res = await fetch(url);
      data = await res.json();
      source = "forecast";
    } else {
      // Use last year's data as reference
      const lastYear = new Date(tripStart);
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      const startStr = lastYear.toISOString().split("T")[0];
      const endDate = new Date(TRIP_END);
      endDate.setFullYear(endDate.getFullYear() - 1);
      const endStr = endDate.toISOString().split("T")[0];

      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${TOKYO_LAT}&longitude=${TOKYO_LON}&start_date=${startStr}&end_date=${endStr}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Asia/Tokyo`;
      const res = await fetch(url);
      data = await res.json();
      source = "historical";
    }

    if (!data.daily) {
      return new Response(JSON.stringify({ error: "No weather data", raw: data }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const days = data.daily.time.map((date: string, i: number) => {
      const code = data.daily.weather_code[i];
      const info = getWeatherInfo(code);
      // Map historical date to 2026 date
      const actualDate = source === "historical"
        ? date.replace(/^\d{4}/, "2026")
        : date;

      return {
        date: actualDate,
        dayNumber: i + 1,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        rain: data.daily.precipitation_sum[i],
        rainProb: data.daily.precipitation_probability_max?.[i] ?? null,
        code,
        description: info.desc,
        emoji: info.emoji,
      };
    });

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

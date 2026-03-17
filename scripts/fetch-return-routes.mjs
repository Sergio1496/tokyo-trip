import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Read .env
const envFile = readFileSync(resolve(root, ".env"), "utf8");
const apiKey = envFile.match(/SERPAPI_KEY=(.+)/)?.[1]?.trim();
if (!apiKey) { console.error("SERPAPI_KEY not found in .env"); process.exit(1); }

// Return routes to fetch
const returnRoutes = [
  { from: "Akihabara", to: "Akabane" },
  { from: "Nakano", to: "Ikebukuro" },
  { from: "Ueno", to: "Akabane" },
  { from: "Nippori", to: "Akabane" },
  { from: "Shinjuku", to: "Ukima-Funado" },
  { from: "Shibuya", to: "Ukima-Funado" },
  { from: "Kamakura", to: "Shinjuku" },
  { from: "Tokyo", to: "Akabane" },
  { from: "Kawagoe", to: "Ukima-Funado" },
  { from: "Todoroki", to: "Shibuya" },
  { from: "Kasukabe", to: "Omiya" },
  { from: "Omiya", to: "Akabane" },
];

function formatAddr(name) {
  if (name === "Narita") return "Narita Airport, Japan";
  const outOfTokyo = ["Kamakura", "Kawagoe", "Kasukabe", "Omiya"];
  if (outOfTokyo.includes(name)) return `${name} Station, Japan`;
  return `${name} Station, Tokyo, Japan`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Load existing data
const cacheFile = resolve(root, "src/data/transit-costs.json");
const cache = JSON.parse(readFileSync(cacheFile, "utf8"));

let queried = 0;
let errors = 0;

for (let i = 0; i < returnRoutes.length; i++) {
  const { from, to } = returnRoutes[i];
  const key = `${from} -> ${to}`;

  if (cache[key]) {
    console.log(`[${i + 1}/${returnRoutes.length}] ${key}: already cached, skipping`);
    continue;
  }

  const startAddr = formatAddr(from);
  const endAddr = formatAddr(to);
  console.log(`\n[${i + 1}/${returnRoutes.length}] ${key}`);
  console.log(`  Querying: ${startAddr}  -->  ${endAddr}`);

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_maps_directions");
  url.searchParams.set("start_addr", startAddr);
  url.searchParams.set("end_addr", endAddr);
  url.searchParams.set("travel_mode", "3");
  url.searchParams.set("hl", "en");
  url.searchParams.set("api_key", apiKey);

  try {
    const res = await fetch(url.toString());
    const data = await res.json();

    if (!data.directions || data.directions.length === 0) {
      console.log(`  --> ERROR: No results`);
      errors++;
      await sleep(2000);
      continue;
    }

    const dir = data.directions[0];
    const stops = (dir.trips || []).map((t) => ({
      line: t.title || "Walk",
      operator: t.service_run_by?.name || null,
      from_stop: t.start_stop?.name || null,
      to_stop: t.end_stop?.name || null,
    }));

    cache[key] = {
      cost: dir.cost || 0,
      currency: dir.currency || "JPY",
      duration: dir.formatted_duration || "",
      distance: dir.formatted_distance || "",
      line: stops.filter((s) => s.line !== "Walk").map((s) => `${s.line} (${s.operator})`).join(" + ") || dir.via || "",
      lines: stops.map((s) => s.line === "Walk" ? "Walk" : `${s.line} (${s.operator})`),
      stops,
      alternatives: data.directions.slice(1, 4).map((alt) => {
        const altStops = (alt.trips || []).map((t) => ({
          line: t.title || "Walk",
          operator: t.service_run_by?.name || null,
          from_stop: t.start_stop?.name || null,
          to_stop: t.end_stop?.name || null,
        }));
        return {
          cost: alt.cost || 0,
          currency: alt.currency || "JPY",
          duration: alt.formatted_duration || "",
          distance: alt.formatted_distance || "",
          line: altStops.filter((s) => s.line !== "Walk").map((s) => `${s.line} (${s.operator})`).join(" + ") || alt.via || "",
          lines: altStops.map((s) => s.line === "Walk" ? "Walk" : `${s.line} (${s.operator})`),
          stops: altStops,
        };
      }),
    };

    const mainLine = stops.filter((s) => s.line !== "Walk").map((s) => s.line).join(" + ");
    console.log(`  --> ${dir.cost} ${dir.currency} | ${dir.formatted_duration} | ${mainLine}`);
    queried++;
  } catch (err) {
    console.log(`  --> ERROR: ${err.message}`);
    errors++;
  }

  await sleep(2000);
}

writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
console.log(`\n${"=".repeat(60)}`);
console.log(`Done! Results saved to: ${cacheFile}`);
console.log(`  Queried: ${queried} | Errors: ${errors}`);

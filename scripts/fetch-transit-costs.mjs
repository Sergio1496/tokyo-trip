import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// 1. Parse .env for SERPAPI_KEY
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = resolve(ROOT, ".env");
  if (!existsSync(envPath)) {
    console.error("ERROR: .env file not found at", envPath);
    console.error("Create it with: SERPAPI_KEY=your_key_here");
    process.exit(1);
  }
  const lines = readFileSync(envPath, "utf-8").split("\n");
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnv();
const API_KEY = env.SERPAPI_KEY;
if (!API_KEY) {
  console.error("ERROR: SERPAPI_KEY not found in .env file");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Define all route segments from the itinerary (deduplicated, no walks/bus)
// ---------------------------------------------------------------------------
const WALKING_LINES = ["andando", "walk", "a pie"];
const BUS_LINES = ["bus", "fujikyu bus"];

/** All raw segments from the itinerary. */
const RAW_SEGMENTS = [
  // Day 1
  { from: "Narita", to: "Ueno", line: "Keisei Skyliner" },
  { from: "Ueno", to: "Ukima-Funado", line: "JR Keihin-Tohoku + JR Saikyo" },
  // Day 2
  { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo" },
  { from: "Akabane", to: "Akihabara", line: "JR Keihin-Tohoku" },
  // Day 3
  { from: "Ukima-Funado", to: "Ikebukuro", line: "JR Saikyo" },
  { from: "Ikebukuro", to: "Nakano", line: "JR Saikyo + JR Chuo" },
  // Day 4
  { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo" },
  { from: "Akabane", to: "Ueno", line: "JR Keihin-Tohoku" },
  { from: "Ueno", to: "Asakusa", line: "Andando" }, // walking - will be skipped
  // Day 5
  { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo" },
  { from: "Akabane", to: "Nippori", line: "JR Keihin-Tohoku" },
  // Day 6
  { from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyo" },
  // Day 7
  { from: "Ukima-Funado", to: "Shibuya", line: "JR Saikyo" },
  // Day 8
  { from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyo" },
  { from: "Shinjuku", to: "Kamakura", line: "JR Shonan-Shinjuku" },
  // Day 9
  { from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyo" },
  { from: "Shinjuku", to: "Kawaguchiko", line: "Fujikyu Bus" }, // bus - will be skipped
  // Day 10
  { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo" },
  { from: "Akabane", to: "Tokyo", line: "JR Keihin-Tohoku" },
  // Day 11
  { from: "Ukima-Funado", to: "Kawagoe", line: "JR Saikyo" },
  // Day 12
  { from: "Ukima-Funado", to: "Shibuya", line: "JR Saikyo" },
  { from: "Shibuya", to: "Todoroki", line: "Tokyu Oimachi Line" },
  // Day 13
  { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo" },
  { from: "Akabane", to: "Omiya", line: "JR Utsunomiya" },
  { from: "Omiya", to: "Kasukabe", line: "Tobu Line" },
  // Day 14
  { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo" },
  { from: "Akabane", to: "Nippori", line: "JR Keihin-Tohoku" },
  { from: "Nippori", to: "Narita", line: "Keisei Skyliner" },
];

// Filter out walking and bus segments, then deduplicate by "from -> to"
function shouldSkip(segment) {
  const lineLower = segment.line.toLowerCase();
  if (WALKING_LINES.some((w) => lineLower.includes(w))) return true;
  if (BUS_LINES.some((b) => lineLower === b)) return true;
  return false;
}

function segmentKey(from, to) {
  return `${from} -> ${to}`;
}

const uniqueSegments = new Map();
for (const seg of RAW_SEGMENTS) {
  if (shouldSkip(seg)) {
    console.log(`Skipping (${seg.line}): ${seg.from} -> ${seg.to}`);
    continue;
  }
  const key = segmentKey(seg.from, seg.to);
  if (!uniqueSegments.has(key)) {
    uniqueSegments.set(key, seg);
  }
}

console.log(`\nFound ${uniqueSegments.size} unique transit segments to query.\n`);

// ---------------------------------------------------------------------------
// 3. Format station names for Google Maps
// ---------------------------------------------------------------------------
function formatStationName(name) {
  // Narita is an airport, not a station
  if (name.toLowerCase() === "narita") {
    return "Narita Airport, Japan";
  }
  // Tokyo Station is already clear
  if (name.toLowerCase() === "tokyo") {
    return "Tokyo Station, Tokyo, Japan";
  }
  // Kamakura and Kawagoe are cities - use "Station" for clarity
  // Kawaguchiko should have been filtered (bus), but just in case
  const citySuffixes = ["kamakura", "kawagoe", "kasukabe", "kawaguchiko"];
  if (citySuffixes.includes(name.toLowerCase())) {
    return `${name} Station, Japan`;
  }
  // For Tokyo area stations, add "Station, Tokyo, Japan"
  return `${name} Station, Tokyo, Japan`;
}

// ---------------------------------------------------------------------------
// 4. Call SerpAPI for each segment
// ---------------------------------------------------------------------------
async function fetchTransitDirections(from, to) {
  const startAddr = formatStationName(from);
  const endAddr = formatStationName(to);

  const params = new URLSearchParams({
    engine: "google_maps_directions",
    start_addr: startAddr,
    end_addr: endAddr,
    travel_mode: "3", // transit
    hl: "en",
    api_key: API_KEY,
  });

  const url = `https://serpapi.com/search.json?${params.toString()}`;

  console.log(`  Querying: ${startAddr}  -->  ${endAddr}`);

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`SerpAPI error: ${data.error}`);
  }

  return data;
}

function parseDirectionsResponse(data, expectedLine) {
  const directions = data.directions || [];

  if (directions.length === 0) {
    return null;
  }

  // Try to find the best match based on expected line name
  const results = directions.map((dir) => {
    const trips = dir.trips || [];
    const transitTrips = trips.filter(
      (t) => t.travel_mode === "Transit" || t.title
    );

    const lineNames = transitTrips
      .map((t) => {
        const parts = [t.title];
        if (t.service_run_by?.name) parts.push(`(${t.service_run_by.name})`);
        return parts.join(" ");
      })
      .filter(Boolean);

    const stops = transitTrips.map((t) => ({
      line: t.title || "Unknown",
      operator: t.service_run_by?.name || null,
      from_stop: t.start_stop?.name || null,
      to_stop: t.end_stop?.name || null,
    }));

    return {
      cost: dir.cost ?? null,
      currency: dir.currency || "JPY",
      duration: dir.formatted_duration || null,
      distance: dir.formatted_distance || null,
      lines: lineNames,
      line: lineNames[0] || null,
      stops,
    };
  });

  // Pick the first result as primary (usually the recommended one)
  const primary = results[0];
  const alternatives = results.slice(1);

  return {
    cost: primary.cost,
    currency: primary.currency,
    duration: primary.duration,
    distance: primary.distance,
    line: primary.line,
    lines: primary.lines,
    stops: primary.stops,
    alternatives: alternatives.map((alt) => ({
      cost: alt.cost,
      currency: alt.currency,
      duration: alt.duration,
      distance: alt.distance,
      line: alt.line,
      lines: alt.lines,
      stops: alt.stops,
    })),
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// 5. Main execution
// ---------------------------------------------------------------------------
async function main() {
  const results = {};
  const entries = Array.from(uniqueSegments.entries());
  let completed = 0;

  for (const [key, seg] of entries) {
    completed++;
    console.log(`[${completed}/${entries.length}] ${key}`);

    try {
      const data = await fetchTransitDirections(seg.from, seg.to);
      const parsed = parseDirectionsResponse(data, seg.line);

      if (parsed) {
        results[key] = parsed;
        console.log(
          `  --> ${parsed.cost ?? "?"} ${parsed.currency} | ${parsed.duration} | ${parsed.line}\n`
        );
      } else {
        results[key] = {
          cost: null,
          currency: "JPY",
          duration: null,
          distance: null,
          line: seg.line,
          lines: [seg.line],
          stops: [],
          alternatives: [],
          error: "No directions found",
        };
        console.log(`  --> No directions found\n`);
      }
    } catch (err) {
      console.error(`  --> ERROR: ${err.message}\n`);
      results[key] = {
        cost: null,
        currency: "JPY",
        duration: null,
        distance: null,
        line: seg.line,
        lines: [seg.line],
        stops: [],
        alternatives: [],
        error: err.message,
      };
    }

    // Wait 2 seconds between calls to respect rate limits
    if (completed < entries.length) {
      await sleep(2000);
    }
  }

  // Ensure output directory exists
  const outDir = resolve(ROOT, "src", "data");
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const outPath = resolve(outDir, "transit-costs.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2), "utf-8");

  console.log("=".repeat(60));
  console.log(`Done! Results saved to: ${outPath}`);
  console.log(`Total segments queried: ${entries.length}`);

  const withCost = Object.values(results).filter((r) => r.cost != null).length;
  const withErrors = Object.values(results).filter((r) => r.error).length;
  console.log(`  With cost data: ${withCost}`);
  console.log(`  With errors:    ${withErrors}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

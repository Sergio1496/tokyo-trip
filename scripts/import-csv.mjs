import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// CSV folder path from args or default
const csvPath = process.argv[2] || "D:/Escritorio/takeout-20260317T104815Z-3-001/Takeout/Save";

// Map CSV filenames to categories
const categoryMap = {
  "Bares": "food",
  "Ramen kyoto": "food",
  "Ramen tokio": "food",
  "Restaurantes Teppanyaki": "food",
  "Restaurantes_cafeterias Tokyo": "food",
  "Templos": "temple",
  "Sitios donde ir Tokyo": "attraction",
  "Sitios favoritos": "attraction",
  "Quiero ir": "attraction",
  "Lista predeterminada": "attraction",
  "Guardadas para más tarde": "attraction",
};

// Read existing itinerary to find already-added places
const itineraryCode = readFileSync(resolve(root, "src/data/itinerary.ts"), "utf8");

function isAlreadyInItinerary(name) {
  // Normalize for comparison
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const itNormalized = itineraryCode.toLowerCase().replace(/[^a-z0-9\n]/g, "");
  return itNormalized.includes(normalized);
}

function parseCsv(content) {
  const lines = content.split("\n");
  const places = [];
  for (let i = 2; i < lines.length; i++) { // skip header + empty line
    const line = lines[i].trim();
    if (!line || line === ",,,,") continue;
    // Simple CSV parse (no quotes expected in these files)
    const parts = line.split(",");
    const title = parts[0]?.trim();
    const note = parts[1]?.trim() || "";
    const url = parts[2]?.trim() || "";
    if (title) {
      places.push({ title, note, url });
    }
  }
  return places;
}

// Load existing imported places if any
const outputPath = resolve(root, "src/data/imported-places.json");
let existing = [];
try {
  existing = JSON.parse(readFileSync(outputPath, "utf8"));
} catch {}

const existingUrls = new Set(existing.map(p => p.url));

// Process all CSV files
const files = readdirSync(csvPath).filter(f => f.endsWith(".csv"));
let added = 0;
let skippedExisting = 0;
let skippedInItinerary = 0;

for (const file of files) {
  const listName = file.replace(".csv", "");
  const cat = categoryMap[listName] || null;
  const content = readFileSync(resolve(csvPath, file), "utf8");
  const places = parseCsv(content);

  for (const place of places) {
    // Skip if already imported
    if (existingUrls.has(place.url)) {
      skippedExisting++;
      continue;
    }

    // Check if already in itinerary
    const inItinerary = isAlreadyInItinerary(place.title);

    existing.push({
      title: place.title,
      note: place.note,
      url: place.url,
      list: listName,
      cat,
      inItinerary,
      assignedDay: null,
    });

    existingUrls.add(place.url);
    added++;

    const status = inItinerary ? " (ya en itinerario)" : "";
    console.log(`  + ${place.title} [${listName}]${status}`);
  }
}

writeFileSync(outputPath, JSON.stringify(existing, null, 2));

console.log(`\n${"=".repeat(50)}`);
console.log(`Importados: ${added} nuevos`);
console.log(`Ya importados: ${skippedExisting}`);
console.log(`Ya en itinerario: ${existing.filter(p => p.inItinerary).length}`);
console.log(`Pendientes de asignar: ${existing.filter(p => !p.inItinerary && !p.assignedDay).length}`);
console.log(`Guardado en: ${outputPath}`);

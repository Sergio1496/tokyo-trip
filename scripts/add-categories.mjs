import { readFileSync, writeFileSync } from "fs";

let code = readFileSync("src/data/itinerary.ts", "utf8");

// Convert isFood: true to cat: 'food'
code = code.replace(/isFood: true,/g, "cat: 'food',");

function addCat(code, names, cat) {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`((?:saved|nuevo)\\("${escaped}[^{]*\\{)`, "g");
    code = code.replace(re, (m) => {
      if (m.includes("cat:")) return m;
      return m + ` cat: '${cat}',`;
    });
  }
  return code;
}

const temples = [
  "Senso-ji",
  "Senso-ji iluminado",
  "Yasakiinari Shrine",
  "Hoon-ji",
  "Genkuji",
  "Templo Sogenji",
  "Akiba Shrine",
  "Santuario Nezu",
  "Santuario Meiji",
  "Templo Hokoku-ji",
  "Templo Hasedera",
  "Chureito Pagoda",
  "Santuario Hikawa",
  "Templo Kitain",
  "Kuhonbutsu Joshin-ji Temple",
  "Santuario Atago",
  "Porton Kaminarimon",
  "Puerta Hozomon",
  "Salon Chingodo",
];

const attractions = [
  "Ueno Park",
  "Ameyoko",
  "Yamashiroya",
  "Akihabara Electric Town",
  "Super Potato",
  "Radio Kaikan",
  "Mandarake Akihabara",
  "Akihabara UDX Parking",
  "Don Quijote Akihabara",
  "Akihabara de noche",
  "Sunshine City",
  "Otome Road",
  "Ikebukuro West Gate Park",
  "Nakano Broadway",
  "Seisuke Knife - Kappabashi",
  "Sumida Park",
  "Yanaka Ginza",
  "Yanaka Cemetery",
  "Callejuelas de Yanaka",
  "SCAI The Bathhouse",
  "Jardines del Palacio Imperial Este",
  "Shinjuku Gyoen",
  "Tokyo Metropolitan Government Building",
  "Kabukicho",
  "Shibuya Scramble Crossing",
  "Estatua de Hachiko",
  "Shibuya Sky",
  "CREATIVE MUSEUM TOKYO",
  "Yoyogi Park",
  "Shibuya de noche",
  "Gran Buda de Kamakura",
  "Calle Komachi-dori",
  "Playa de Yuigahama",
  "Lago Kawaguchi",
  "3495-2 Funatsu",
  "Kogamasao Memorial Park",
  "Oshino Hakkai",
  "Tsukiji Outer Market",
  "Jardin Hamarikyu",
  "Ginza Six",
  "Uniqlo Ginza",
  "Kurazukuri Street",
  "Toki no Kane",
  "Kashiya Yokocho",
  "Surugaya Omiya Maruiten",
  "Todoroki Ravine Park",
  "teamLab Borderless",
  "Tokyo Tower de noche",
  "Junjo Shotengai / Pure Heart Shopping Street",
  "LaLa garden Kasukabe",
];

code = addCat(code, temples, "temple");
code = addCat(code, attractions, "attraction");

writeFileSync("src/data/itinerary.ts", code);

// Count
const foodCount = (code.match(/cat: 'food'/g) || []).length;
const templeCount = (code.match(/cat: 'temple'/g) || []).length;
const attrCount = (code.match(/cat: 'attraction'/g) || []).length;
console.log(`Done! food: ${foodCount}, temple: ${templeCount}, attraction: ${attrCount}`);

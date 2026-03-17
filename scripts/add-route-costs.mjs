import { readFileSync, writeFileSync } from "fs";

let code = readFileSync("src/data/neighborhoods.ts", "utf8");

// Known costs per segment (JR and Metro fares are fixed by distance)
const costs = {
  // JR segments
  'from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyō", duration: "25 min"': '¥260',
  'from: "Shinjuku", to: "Ukima-Funado", line: "JR Saikyō", duration: "19 min"': '¥260',
  'from: "Ukima-Funado", to: "Akabane", line: "JR Saikyō", duration: "3 min"': '¥150',
  'from: "Akabane", to: "Ukima-Funado", line: "JR Saikyō", duration: "3 min"': '¥150',
  'from: "Akabane", to: "Nippori", line: "JR Keihin-Tōhoku", duration: "12 min"': '¥170',
  'from: "Nippori", to: "Akabane", line: "JR Keihin-Tōhoku", duration: "13 min"': '¥170',
  'from: "Ukima-Funado", to: "Ikebukuro", line: "JR Saikyō", duration: "15 min"': '¥210',
  'from: "Ikebukuro", to: "Ukima-Funado", line: "JR Saikyō", duration: "15 min"': '¥210',
  'from: "Akabane", to: "Akihabara", line: "JR Keihin-Tōhoku", duration: "21 min"': '¥230',
  'from: "Akihabara", to: "Akabane", line: "JR Keihin-Tōhoku", duration: "21 min"': '¥230',
  'from: "Ukima-Funado", to: "Shibuya", line: "JR Saikyō", duration: "30 min"': '¥350',
  'from: "Shibuya", to: "Ukima-Funado", line: "JR Saikyō", duration: "31 min"': '¥350',
  'from: "Ukima-Funado", to: "Osaki", line: "JR Saikyō", duration: "28 min"': '¥330',
  'from: "Osaki", to: "Ukima-Funado", line: "JR Saikyō", duration: "28 min"': '¥330',

  // Odakyu
  'from: "Shinjuku", to: "Shimokitazawa", line: "Odakyu", duration: "3 min"': '¥130',
  'from: "Shimokitazawa", to: "Shinjuku", line: "Odakyu", duration: "3 min"': '¥130',

  // JR Chuo
  'from: "Shinjuku", to: "Koenji", line: "JR Chūō", duration: "7 min"': '¥150',
  'from: "Koenji", to: "Shinjuku", line: "JR Chūō", duration: "7 min"': '¥150',
  'from: "Shinjuku", to: "Kichijoji", line: "JR Chūō", duration: "15 min"': '¥230',
  'from: "Kichijoji", to: "Shinjuku", line: "JR Chūō", duration: "15 min"': '¥230',

  // Metro Chiyoda
  'from: "Nippori", to: "Jimbocho", line: "Metro Chiyoda", duration: "15 min"': '¥210',
  'from: "Jimbocho", to: "Nippori", line: "Metro Chiyoda", duration: "15 min"': '¥210',

  // Metro Yurakucho
  'from: "Ikebukuro", to: "Iidabashi", line: "Metro Yūrakuchō", duration: "8 min"': '¥180',
  'from: "Iidabashi", to: "Ikebukuro", line: "Metro Yūrakuchō", duration: "8 min"': '¥180',
  'from: "Ikebukuro", to: "Tsukishima", line: "Metro Yūrakuchō", duration: "22 min"': '¥250',
  'from: "Tsukishima", to: "Ikebukuro", line: "Metro Yūrakuchō", duration: "22 min"': '¥250',

  // JR Sobu
  'from: "Akihabara", to: "Ryogoku", line: "JR Chūō-Sōbu", duration: "5 min"': '¥150',
  'from: "Ryogoku", to: "Akihabara", line: "JR Chūō-Sōbu", duration: "5 min"': '¥150',

  // Metro Hibiya
  'from: "Nippori", to: "Naka-Meguro", line: "Metro Hibiya", duration: "25 min"': '¥250',
  'from: "Naka-Meguro", to: "Nippori", line: "Metro Hibiya", duration: "25 min"': '¥250',
  'from: "Nippori", to: "Ningyocho", line: "Metro Hibiya", duration: "18 min"': '¥210',
  'from: "Ningyocho", to: "Nippori", line: "Metro Hibiya", duration: "18 min"': '¥210',

  // Tokyu Den-en-toshi
  'from: "Shibuya", to: "Sangenjaya", line: "Tokyu Den-en-toshi", duration: "5 min"': '¥140',
  'from: "Sangenjaya", to: "Shibuya", line: "Tokyu Den-en-toshi", duration: "5 min"': '¥140',

  // Keisei
  'from: "Nippori", to: "Takasago", line: "Keisei", duration: "15 min"': '¥260',
  'from: "Takasago", to: "Nippori", line: "Keisei", duration: "15 min"': '¥260',
  'from: "Takasago", to: "Shibamata", line: "Keisei Kanamachi", duration: "3 min"': '¥140',
  'from: "Shibamata", to: "Takasago", line: "Keisei Kanamachi", duration: "3 min"': '¥140',

  // JR Yamanote
  'from: "Osaki", to: "Gotanda", line: "JR Yamanote", duration: "2 min"': '¥150',
  'from: "Gotanda", to: "Osaki", line: "JR Yamanote", duration: "2 min"': '¥150',

  // Tokyu Ikegami
  'from: "Gotanda", to: "Togoshi-Ginza", line: "Tokyu Ikegami", duration: "3 min"': '¥140',
  'from: "Togoshi-Ginza", to: "Gotanda", line: "Tokyu Ikegami", duration: "3 min"': '¥140',
};

let replaced = 0;
for (const [segment, cost] of Object.entries(costs)) {
  const search = `{ ${segment} }`;
  const replace = `{ ${segment}, cost: "${cost}" }`;
  if (code.includes(search)) {
    code = code.replace(search, replace);
    replaced++;
  }
}

writeFileSync("src/data/neighborhoods.ts", code);
console.log(`Added costs to ${replaced} route segments`);

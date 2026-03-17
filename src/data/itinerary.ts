export type ActivityCategory = "food" | "temple" | "attraction";

export interface TransitInfo {
  from: string;
  to: string;
  line: string;
}

export interface Activity {
  name: string;
  saved: boolean;
  isNew: boolean;
  isFood?: boolean;
  cat?: ActivityCategory;
  cost?: string;
  description?: string;
  tips?: string[];
  subItems?: Activity[];
  transit?: TransitInfo[];
}

export interface TimeSlot {
  label: string;
  icon: string;
  timeRange: string;
  activities: Activity[];
}

export interface TransportStep {
  from: string;
  to: string;
  line: string;
  duration: string;
  cost?: string;
}

export interface FlightSegment {
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departure: string;
  arrival: string;
  airline: string;
  flightNumber: string;
  duration: string;
}

export interface DayData {
  dayNumber: number;
  date: string;
  weekday: string;
  title: string;
  subtitle: string;
  area: string;
  route: TransportStep[];
  returnRoute?: TransportStep[];
  timeSlots: TimeSlot[];
  flightInfo?: { segments: FlightSegment[]; bookingRef: string };
  options?: { label: string; activities: Activity[] }[];
}

function a(name: string, opts: Partial<Activity> = {}): Activity {
  return { name, saved: false, isNew: false, ...opts };
}
function saved(name: string, opts: Partial<Activity> = {}): Activity {
  return { name, saved: true, isNew: false, ...opts };
}
function nuevo(name: string, opts: Partial<Activity> = {}): Activity {
  return { name, saved: false, isNew: true, ...opts };
}

export const days: DayData[] = [
  // ============ DIA 1 ============
  {
    dayNumber: 1,
    date: "3 de Mayo",
    weekday: "Domingo",
    title: "Llegada + Ueno",
    subtitle: "Golden Week. Jet lag. Check-in a las 16:00.",
    area: "Ueno",
    route: [
      { from: "Narita", to: "Ueno", line: "Keisei Skyliner", duration: "41 min", cost: "12.62 EUR (KKday)" },
      { from: "Ueno", to: "Ukima-Funado", line: "JR Keihin-Tohoku + JR Saikyo", duration: "20 min", cost: "~230 yen" },
    ],
    flightInfo: {
      bookingRef: "ZNRHMT",
      segments: [
        { from: "Valencia", fromCode: "VLC", to: "Zurich", toCode: "ZRH", departure: "Sab 2 May 06:00", arrival: "08:10", airline: "Swiss", flightNumber: "LX2147", duration: "2h 10min" },
        { from: "Zurich", fromCode: "ZRH", to: "Narita", toCode: "NRT", departure: "Sab 2 May 13:05", arrival: "Dom 3 May 09:10", airline: "Swiss", flightNumber: "LX160", duration: "13h 05min" },
      ],
    },
    timeSlots: [
      {
        label: "Mañana / Mediodía",
        icon: "sun",
        timeRange: "9:10 - 15:30",
        activities: [
          a("Aterrizar a las 9:10 en Narita Terminal 1 (Swiss)"),
          a("Migración y aduana (~30-45 min)"),
          a("Comprar/cargar Suica o ICOCA en las máquinas del aeropuerto"),
          a("Canjear voucher KKday en mostrador Keisei"),
          a("Keisei Skyliner a Ueno (~41 min)", { cost: "12.62 EUR", transit: [{ from: "Narita", to: "Ueno", line: "Keisei Skyliner" }] }),
          a("Dejar maletas en coin lockers de JR Ueno Station", { cost: "~400-700 yen/taquilla", tips: ["Buscar las taquillas grandes para maletas"] }),
          nuevo("Ueno Park", { cat: 'attraction', cost: "GRATIS", description: "Lago Shinobazu con lotos, Templo Bentendo, paseo tranquilo" }),
          nuevo("Ameyoko", { cat: 'attraction', cost: "GRATIS", description: "Mercado callejero bajo las vias del tren. Comida callejera barata, fruta, snacks" }),
          saved("Yamashiroya", { cat: 'attraction', description: "Tienda de juguetes de 6 pisos" }),
        ],
      },
      {
        label: "Tarde",
        icon: "sunset",
        timeRange: "15:30 - 16:30",
        activities: [
          a("Recoger maletas de coin lockers"),
          a("JR Keihin-Tohoku a Akabane + JR Saikyo a Ukima-Funado (~20 min)", { transit: [{ from: "Ueno", to: "Akabane", line: "JR Keihin-Tōhoku" }, { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyō" }] }),
          a("Check-in en Tanpopo Inn a las 16:00"),
          a("Descansar, ducharse, aterrizar"),
        ],
      },
      {
        label: "Noche",
        icon: "moon",
        timeRange: "18:00+",
        activities: [
          saved("Haruki Kitaakabane", { cat: 'food', description: "Ramen. Literalmente al lado de casa" }),
          a("Paseo nocturno por el barrio para orientarse"),
          a("Konbini para comprar desayuno y provisiones"),
        ],
      },
    ],
  },
  // ============ DIA 2 ============
  {
    dayNumber: 2,
    date: "4 de Mayo",
    weekday: "Lunes",
    title: "Akihabara",
    subtitle: "Golden Week. Mayormente interior, ideal para evitar multitudes.",
    area: "Akihabara",
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo", duration: "3 min" },
      { from: "Akabane", to: "Akihabara", line: "JR Keihin-Tohoku", duration: "22 min" },
    ],
    returnRoute: [
      { from: "Akihabara", to: "Akabane", line: "JR Keihin-Tohoku", duration: "21 min" },
      { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyo", duration: "3 min" },
    ],
    timeSlots: [
      {
        label: "Mañana",
        icon: "sun",
        timeRange: "9:00 - 13:00",
        activities: [
          saved("Akihabara Electric Town"),
          saved("AmiAmi", { cat: 'attraction', description: "Figuras, manga, coleccionismo" }),
          nuevo("Super Potato", { cat: 'attraction', cost: "GRATIS", description: "5 pisos de retro gaming, se puede jugar" }),
          nuevo("Radio Kaikan", { cat: 'attraction', description: "Edificio de tiendas otaku" }),
          nuevo("Mandarake Akihabara", { cat: 'attraction', description: "Manga y figuras raras" }),
          a("Game centers / arcades (muchas plantas gratis)"),
        ],
      },
      {
        label: "Tarde",
        icon: "sunset",
        timeRange: "13:00 - 18:00",
        activities: [
          saved("Cat Cafe MOCHA", { cat: 'food', cost: "~1.300 yen/hora", description: "Con bebida incluida" }),
          saved("Akihabara UDX Parking", { cat: 'attraction', description: "A veces hay car meets en festivos" }),
          nuevo("Don Quijote Akihabara", { cat: 'attraction', description: "Compras baratas y souvenirs" }),
          saved("Tenkaippin Akihabara", { cat: 'food', description: "Ramen de caldo ultra espeso" }),
        ],
      },
      {
        label: "Noche",
        icon: "moon",
        timeRange: "18:00+",
        activities: [
          nuevo("Akihabara de noche", { cat: 'attraction', cost: "GRATIS", description: "Las luces de neon son espectaculares" }),
        ],
      },
    ],
  },
  // ============ DIA 3 ============
  {
    dayNumber: 3,
    date: "5 de Mayo",
    weekday: "Martes",
    title: "Ikebukuro + Nakano",
    subtitle: "Golden Week - Día del Niño. JR Saikyo directo, sin transbordos.",
    area: "Ikebukuro / Nakano",
    route: [
      { from: "Ukima-Funado", to: "Ikebukuro", line: "JR Saikyo", duration: "15 min" },
      { from: "Ikebukuro", to: "Nakano", line: "JR Saikyo + JR Chuo", duration: "~15 min" },
    ],
    returnRoute: [
      { from: "Nakano", to: "Ikebukuro", line: "JR Chuo + JR Saikyo", duration: "16 min" },
      { from: "Ikebukuro", to: "Ukima-Funado", line: "JR Saikyo", duration: "15 min" },
    ],
    timeSlots: [
      {
        label: "Mañana",
        icon: "sun",
        timeRange: "9:00 - 13:00",
        activities: [
          saved("Mendokoro Hanada Ikebukuro", { cat: 'food', description: "Tsukemen famoso. Ir temprano, hay cola" }),
          nuevo("Sunshine City", { cat: 'attraction',
            description: "Centro comercial enorme",
            subItems: [
              nuevo("Pokemon Center Mega Tokyo"),
              nuevo("Namja Town", { description: "Parque tematico de gyozas" }),
              nuevo("Acuario", { cost: "2.600 yen", description: "Opcional" }),
            ],
          }),
          nuevo("Otome Road", { cat: 'attraction', cost: "GRATIS", description: "Zona otaku/manga" }),
          nuevo("Ikebukuro West Gate Park", { cat: 'attraction', cost: "GRATIS", description: "El parque de la serie/anime" }),
        ],
      },
      {
        label: "Tarde",
        icon: "sunset",
        timeRange: "14:00 - 18:00",
        activities: [
          a("Ir a Nakano (~15 min)", { transit: [{ from: "Ikebukuro", to: "Nakano", line: "JR Chūō" }] }),
          saved("Nakano Broadway", { cat: 'attraction',
            description: "El Akihabara underground, menos turístico y más barato",
            subItems: [
              nuevo("Mandarake Nakano", { description: "La meca del manga/figuras vintage" }),
              a("Tiendas de retro gaming, figuras, vinilo, relojes vintage"),
            ],
          }),
        ],
      },
      {
        label: "Noche",
        icon: "moon",
        timeRange: "18:00+",
        activities: [
          saved("Yakinikuraiku Nakanosanmoruten", { cat: 'food', description: "Yakiniku en Nakano" }),
          a("O cenar en Ikebukuro de vuelta (muchas opciones baratas)"),
        ],
      },
    ],
  },
  // ============ DIA 4 ============
  {
    dayNumber: 4,
    date: "6 de Mayo",
    weekday: "Miércoles",
    title: "Asakusa + Kappabashi",
    subtitle: "Golden Week terminada. Menos gente.",
    area: "Asakusa",
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo", duration: "3 min" },
      { from: "Akabane", to: "Ueno", line: "JR Keihin-Tohoku", duration: "17 min" },
      { from: "Ueno", to: "Asakusa", line: "Andando", duration: "15 min" },
    ],
    returnRoute: [
      { from: "Asakusa", to: "Ueno", line: "Andando", duration: "15 min" },
      { from: "Ueno", to: "Akabane", line: "JR Utsunomiya", duration: "9 min" },
      { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyo", duration: "3 min" },
    ],
    timeSlots: [
      {
        label: "Mañana",
        icon: "sun",
        timeRange: "9:00 - 13:00",
        activities: [
          saved("Porton Kaminarimon", { cat: 'temple', cost: "GRATIS", description: "Icónica puerta roja con farol gigante" }),
          a("Calle Nakamise-dori", { description: "Snacks baratos, souvenirs" }),
          saved("Puerta Hozomon", { cat: 'temple', cost: "GRATIS" }),
          saved("Senso-ji", { cat: 'temple', cost: "GRATIS", description: "El templo principal de Asakusa" }),
          saved("Salon Chingodo", { cat: 'temple', cost: "GRATIS" }),
          saved("Yasakiinari Shrine", { cat: 'temple', cost: "GRATIS", description: "Torii rojos" }),
          saved("Hoon-ji", { cat: 'temple', cost: "GRATIS" }),
          saved("Genkuji", { cat: 'temple', cost: "GRATIS" }),
          saved("Templo Sogenji", { cat: 'temple', cost: "GRATIS" }),
          saved("Akiba Shrine", { cat: 'temple', cost: "GRATIS" }),
          nuevo("Sumida Park", { cat: 'attraction', cost: "GRATIS", description: "Vistas al Skytree desde el rio" }),
        ],
      },
      {
        label: "Tarde",
        icon: "sunset",
        timeRange: "13:00 - 18:00",
        activities: [
          a("Asakusa a Kappabashi (~10 min)", { transit: [{ from: "Asakusa", to: "Kappabashi", line: "Andando" }] }),
          saved("Seisuke Knife - Kappabashi", { cat: 'attraction', description: "Calle de utensilios de cocina, cuchillos japoneses, réplicas de comida en cera. GRATIS pasear" }),
          a("Kappabashi a Okachimachi (~15 min)", { transit: [{ from: "Kappabashi", to: "Okachimachi", line: "Andando" }] }),
          saved("Ramen Kamo to Negi", { cat: 'food', description: "Ramen de pato, en Okachimachi" }),
          a("Okachimachi a Ueno (~5 min)", { transit: [{ from: "Okachimachi", to: "Ueno", line: "Andando" }] }),
        ],
      },
      {
        label: "Noche",
        icon: "moon",
        timeRange: "18:00+",
        activities: [
          nuevo("Senso-ji iluminado de noche", { cat: 'temple', cat: 'temple', cost: "GRATIS", description: "Espectacular y mucha menos gente" }),
        ],
      },
    ],
  },
  // ============ DIA 5 ============
  {
    dayNumber: 5,
    date: "7 de Mayo",
    weekday: "Jueves",
    title: "Yanaka + Nezu",
    subtitle: "Barrio más auténtico de Tokyo. Todo caminable. Muy barato.",
    area: "Yanaka / Nezu",
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo", duration: "3 min" },
      { from: "Akabane", to: "Nippori", line: "JR Keihin-Tohoku", duration: "12 min" },
    ],
    returnRoute: [
      { from: "Nippori", to: "Akabane", line: "JR Keihin-Tohoku", duration: "13 min" },
      { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyo", duration: "3 min" },
    ],
    timeSlots: [
      {
        label: "Mañana",
        icon: "sun",
        timeRange: "9:00 - 13:00",
        activities: [
          nuevo("Yanaka Ginza", { cat: 'attraction', cost: "GRATIS", description: "Calle comercial retro, snacks baratos (croquetas 100 yen, helados 200 yen)" }),
          nuevo("Yanaka Cemetery", { cat: 'attraction', cost: "GRATIS", description: "Paseo tranquilo entre árboles" }),
          nuevo("Callejuelas de Yanaka", { cat: 'attraction', cost: "GRATIS", description: "Casas tradicionales, gatos por todas partes" }),
          nuevo("SCAI The Bathhouse", { cat: 'attraction', cost: "GRATIS", description: "Galería de arte en un antiguo baño público" }),
        ],
      },
      {
        label: "Tarde",
        icon: "sunset",
        timeRange: "13:00 - 17:00",
        activities: [
          a("Yanaka a Nezu (~15 min)", { transit: [{ from: "Yanaka", to: "Nezu", line: "Andando" }] }),
          saved("Santuario Nezu", { cat: 'temple', cost: "GRATIS", description: "En mayo: Festival de Azaleas (Bunkyo Tsutsuji Matsuri). Torii rojos estilo mini-Fushimi Inari" }),
          a("Nezu a Palacio Imperial (~20 min)", { transit: [{ from: "Nezu", to: "Otemachi", line: "Metro Chiyoda" }] }),
          nuevo("Jardines del Palacio Imperial Este", { cat: 'attraction', cost: "GRATIS", description: "Los jardines del emperador, con fosos, murallas, naturaleza. Muy tranquilos" }),
        ],
      },
      {
        label: "Noche",
        icon: "moon",
        timeRange: "17:00+",
        activities: [
          a("Cenar en la zona de Ueno/Okachimachi (izakayas baratas)"),
          saved("Ramen Kamo to Negi", { cat: 'food', description: "Si no lo probasteis el dia anterior" }),
        ],
      },
    ],
  },
  // ============ DIA 6 ============
  {
    dayNumber: 6,
    date: "8 de Mayo",
    weekday: "Viernes",
    title: "Shinjuku",
    subtitle: "JR Saikyo directo 25 min. Jardín zen por la mañana, neon por la noche.",
    area: "Shinjuku",
    route: [
      { from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyo", duration: "25 min" },
    ],
    returnRoute: [
      { from: "Shinjuku", to: "Ukima-Funado", line: "JR Saikyo", duration: "19 min" },
    ],
    timeSlots: [
      {
        label: "Mañana",
        icon: "sun",
        timeRange: "9:00 - 13:00",
        activities: [
          nuevo("Shinjuku Gyoen", { cat: 'attraction', cost: "500 yen", description: "Jardín japonés, inglés, francés + invernadero tropical" }),
          nuevo("Tokyo Metropolitan Government Building (TMG)", { cat: 'attraction', cost: "GRATIS", description: "Mirador planta 45. Vistas 360 de Tokyo. Se ve el Monte Fuji en días claros" }),
        ],
      },
      {
        label: "Tarde",
        icon: "sunset",
        timeRange: "14:00 - 18:00",
        activities: [
          nuevo("Kabukicho", { cat: 'attraction', cost: "GRATIS", description: "Barrio de entretenimiento, Godzilla Head en Hotel Gracery" }),
          saved("Sumibiyaki noukou chuka soba seafood", { cat: 'food', description: "Ramen de marisco con carbon" }),
          saved("HALAL WAGYU RAMEN SHINJUKU-TEI", { cat: 'food', description: "Ramen wagyu" }),
        ],
      },
      {
        label: "Noche",
        icon: "moon",
        timeRange: "18:00+",
        activities: [
          saved("Omoide Yokocho / Callejón de los Recuerdos", { cat: 'food', description: "Callejones con yakitori desde 100-200 yen, cerveza barata. Ambiente increíble" }),
          nuevo("Golden Gai", { cat: 'food', cost: "GRATIS", description: "200+ bares minúsculos (6-8 personas). Muchos no cobran cover a extranjeros" }),
        ],
      },
    ],
  },
  // ============ DIA 7 ============
  {
    dayNumber: 7,
    date: "9 de Mayo",
    weekday: "Sábado",
    title: "Shibuya + Harajuku",
    subtitle: "JR Saikyo directo 30 min. Zonas contiguas, todo andando.",
    area: "Shibuya / Harajuku",
    route: [
      { from: "Ukima-Funado", to: "Shibuya", line: "JR Saikyo", duration: "30 min" },
    ],
    returnRoute: [
      { from: "Shibuya", to: "Ukima-Funado", line: "JR Saikyo", duration: "31 min" },
    ],
    timeSlots: [
      {
        label: "Mañana",
        icon: "sun",
        timeRange: "9:00 - 13:00",
        activities: [
          nuevo("Santuario Meiji (Meiji Jingu)", { cat: 'temple', cost: "GRATIS", description: "El más importante de Tokyo, dentro de un bosque enorme. Ir temprano" }),
          a("Takeshita Street", { cost: "GRATIS", description: "La calle mas loca de moda juvenil" }),
          saved("Marion Crepes", { cat: 'food', description: "Crepes en Takeshita Street" }),
          saved("Harajuku Gyozarou", { cat: 'food', description: "Gyozas míticas. Ir temprano o habrá cola" }),
        ],
      },
      {
        label: "Tarde",
        icon: "sunset",
        timeRange: "13:00 - 18:00",
        activities: [
          a("Harajuku a Shibuya (~15 min)", { transit: [{ from: "Harajuku", to: "Shibuya", line: "Andando" }] }),
          saved("Shibuya Scramble Crossing", { cat: 'attraction', cost: "GRATIS", description: "El cruce más famoso del mundo" }),
          nuevo("Estatua de Hachiko", { cat: 'attraction', cost: "GRATIS", description: "El perro fiel" }),
          nuevo("Shibuya Sky", { cat: 'attraction', cost: "2.000 yen", description: "Mirador 360 en azotea (opcional, ya teneis TMG gratis)" }),
          saved("CREATIVE MUSEUM TOKYO"),
          nuevo("Yoyogi Park", { cat: 'attraction', cat: 'attraction', cost: "GRATIS", description: "Enorme parque al lado, artistas callejeros los fines de semana" }),
          saved("ICHIRAN Shibuya", { cat: 'food', cost: "~1.000 yen", description: "Ramen en cabinas individuales" }),
          saved("Oreryu Shio Ramen Shibuya", { cat: 'food', description: "Teneis 2 locales guardados en Shibuya" }),
        ],
      },
      {
        label: "Noche",
        icon: "moon",
        timeRange: "18:00+",
        activities: [
          saved("Shibuya Nonbei Yokocho", { cat: 'food', description: "Callejón de bares diminutos, como Golden Gai pero más íntimo" }),
          nuevo("Shibuya de noche", { cat: 'attraction', cost: "GRATIS", description: "Pantallas gigantes iluminadas" }),
        ],
      },
    ],
  },
  // ============ DIA 8 ============
  {
    dayNumber: 8,
    date: "10 de Mayo",
    weekday: "Domingo",
    title: "Excursion: Kamakura",
    subtitle: "~1h15 desde Shinjuku. JR Shonan-Shinjuku Line directo.",
    area: "Kamakura",
    route: [
      { from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyo", duration: "25 min" },
      { from: "Shinjuku", to: "Kamakura", line: "JR Shonan-Shinjuku", duration: "60 min" },
    ],
    returnRoute: [
      { from: "Kamakura", to: "Shinjuku", line: "JR Yokosuka + JR Yamanote", duration: "1h 15 min" },
      { from: "Shinjuku", to: "Ukima-Funado", line: "JR Saikyo", duration: "19 min" },
    ],
    timeSlots: [
      {
        label: "Día completo",
        icon: "sun",
        timeRange: "8:00 - 19:00",
        activities: [
          saved("Templo Hokoku-ji", { cat: 'temple', cost: "300 yen", description: "Bosque de bambu de Kamakura", tips: ["Tomar matcha en el jardin (600 yen) - experiencia unica"] }),
          nuevo("Gran Buda de Kamakura (Kotoku-in)", { cat: 'attraction', cost: "300 yen", description: "Buda al aire libre de 13 metros. Entrar dentro +50 yen" }),
          nuevo("Templo Hasedera", { cat: 'temple', cost: "400 yen", description: "Vistas al mar, cuevas con estatuas, jardin japones" }),
          nuevo("Calle Komachi-dori", { cat: 'attraction', cost: "GRATIS", description: "Calle comercial con snacks, tiendas, helados" }),
          nuevo("Playa de Yuigahama", { cat: 'attraction', cost: "GRATIS", description: "Paseo por la playa al atardecer antes de volver" }),
          a("Coste total actividades: ~1.050 yen (sin matcha) o ~1.650 yen (con matcha)"),
        ],
      },
      {
        label: "Vuelta",
        icon: "moon",
        timeRange: "19:00+",
        activities: [
          a("Cenar por el camino en Shinjuku o en casa"),
        ],
      },
    ],
  },
  // ============ DIA 9 ============
  {
    dayNumber: 9,
    date: "11 de Mayo",
    weekday: "Lunes",
    title: "Excursion: Monte Fuji",
    subtitle: "Bus desde Shinjuku ~2h. Reservar ida y vuelta con antelación.",
    area: "Fujikawaguchiko",
    route: [
      { from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyo", duration: "25 min" },
      { from: "Shinjuku", to: "Kawaguchiko", line: "Fujikyu Bus", duration: "~2h", cost: "~2.000-2.500 yen ida" },
    ],
    returnRoute: [
      { from: "Kawaguchiko", to: "Shinjuku", line: "Fujikyu Bus", duration: "~2h", cost: "~2.000-2.500 yen" },
      { from: "Shinjuku", to: "Ukima-Funado", line: "JR Saikyo", duration: "19 min" },
    ],
    timeSlots: [
      {
        label: "Día completo",
        icon: "sun",
        timeRange: "7:00 - 19:00",
        activities: [
          a("Bus Shinjuku -> Kawaguchiko (Fujikyu Bus)", { cost: "~2.000-2.500 yen ida", tips: ["Reservar online en fujikyu-bus.co.jp con antelación (se llena)"] }),
          saved("Fujikawaguchiko"),
          nuevo("Lago Kawaguchi", { cat: 'attraction', cost: "GRATIS", description: "Vistas épicas del Fuji reflejado en el lago" }),
          saved("3495-2 Funatsu", { cat: 'attraction', description: "El Lawson de las fotos del Monte Fuji" }),
          nuevo("Chureito Pagoda", { cat: 'temple', cost: "GRATIS", description: "La foto clásica del Fuji con pagoda roja. ~400 escalones. A 20 min en tren local", tips: ["Ir temprano para evitar multitudes"] }),
          saved("Kogamasao Memorial Park"),
          nuevo("Oshino Hakkai", { cat: 'attraction', cat: 'attraction', cost: "GRATIS (algunas pozas 300 yen)", description: "Pueblo con pozas cristalinas alimentadas por el Fuji" }),
        ],
      },
      {
        label: "Vuelta",
        icon: "moon",
        timeRange: "19:00+",
        activities: [
          a("Bus vuelta a Shinjuku (~2h). Ultimo bus ~19:00-20:00, verificar horarios"),
          a("Tip: Llevar comida/snacks del konbini. La comida en Kawaguchiko es más cara"),
        ],
      },
    ],
  },
  // ============ DIA 10 ============
  {
    dayNumber: 10,
    date: "12 de Mayo",
    weekday: "Martes",
    title: "Ginza + Tsukiji",
    subtitle: "Via Akabane. Dia gastronomico.",
    area: "Ginza / Tsukiji",
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo", duration: "3 min" },
      { from: "Akabane", to: "Tokyo", line: "JR Keihin-Tohoku", duration: "27 min" },
    ],
    returnRoute: [
      { from: "Tokyo", to: "Akabane", line: "JR Utsunomiya", duration: "15 min" },
      { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyo", duration: "3 min" },
    ],
    timeSlots: [
      {
        label: "Mañana",
        icon: "sun",
        timeRange: "8:00 - 12:00",
        activities: [
          nuevo("Tsukiji Outer Market", { cat: 'attraction', cost: "GRATIS entrar", description: "Ir temprano (8-9 AM). Desayuno de sashimi/sushi fresco", tips: ["Tamagoyaki ~100 yen", "Probar uni (erizo), maguro (atun), ikura (huevas)", "Desayuno probando cosas sueltas ~500-1.000 yen"] }),
          nuevo("Jardín Hamarikyu", { cat: 'attraction', cost: "300 yen", description: "Jardín junto a la bahía. Casa de te con matcha (500 yen, opcional)" }),
        ],
      },
      {
        label: "Tarde",
        icon: "sunset",
        timeRange: "12:00 - 18:00",
        activities: [
          a("Tsukiji a Ginza (~10 min)", { transit: [{ from: "Tsukiji", to: "Ginza", line: "Andando" }] }),
          nuevo("Ginza Six", { cat: 'attraction', cost: "GRATIS", description: "Azotea con jardin" }),
          nuevo("Uniqlo Ginza", { cat: 'attraction', description: "Flagship de 12 pisos" }),
          nuevo("Pasear la calle principal de Ginza", { cost: "GRATIS" }),
          a("Ginza a Monzen-nakacho (~15 min)", { transit: [{ from: "Ginza", to: "Monzen-nakacho", line: "Metro Tōzai" }] }),
          saved("Tonkatsu Marushichi | Monzen-nakacho", { cat: 'food', description: "Tonkatsu excelente" }),
        ],
      },
      {
        label: "Noche (elegir uno)",
        icon: "moon",
        timeRange: "18:00+",
        activities: [
          saved("Ginza Yakitori Kato", { cat: 'food', description: "Yakitori premium" }),
          saved("Yakiniku Inoue Ginza", { cat: 'food', description: "Carne a la parrilla" }),
          saved("Sushi Shiogamako Ginza Kiwami", { cat: 'food', description: "Sushi de calidad" }),
        ],
      },
    ],
  },
  // ============ DIA 11 ============
  {
    dayNumber: 11,
    date: "13 de Mayo",
    weekday: "Miércoles",
    title: "Kawagoe (Pequeño Edo)",
    subtitle: "JR Saikyo DIRECTO. ~40 min sin transbordo.",
    area: "Kawagoe",
    route: [
      { from: "Ukima-Funado", to: "Kawagoe", line: "JR Saikyo", duration: "40 min" },
    ],
    returnRoute: [
      { from: "Kawagoe", to: "Ukima-Funado", line: "JR Saikyo", duration: "46 min" },
    ],
    timeSlots: [
      {
        label: "Día completo",
        icon: "sun",
        timeRange: "9:00 - 17:00",
        activities: [
          nuevo("Kurazukuri Street", { cat: 'attraction', cost: "GRATIS", description: "Calle de almacenes estilo Edo. Edificios de 200+ años, muy fotográficos" }),
          nuevo("Toki no Kane", { cat: 'attraction', cost: "GRATIS", description: "Torre del reloj icónico de Kawagoe" }),
          nuevo("Kashiya Yokocho", { cat: 'attraction', description: "Callejón de los dulces. Snacks desde 50 yen, caramelos gigantes" }),
          nuevo("Santuario Hikawa", { cat: 'temple', cost: "GRATIS", description: "Uno de los más bonitos de Saitama" }),
          nuevo("Templo Kitain", { cat: 'temple', cost: "400 yen", description: "500 estatuas Rakan, cada una con expresión única" }),
          a("Almuerzo: probar unagi (anguila), especialidad de Kawagoe", { cost: "~1.500-2.000 yen" }),
        ],
      },
      {
        label: "Tarde / Vuelta",
        icon: "sunset",
        timeRange: "17:00+",
        activities: [
          saved("Surugaya Omiya Maruiten", { cat: 'attraction', description: "Tienda retro gaming/coleccionismo. Parada en Omiya de camino" }),
        ],
      },
    ],
  },
  // ============ DIA 12 ============
  {
    dayNumber: 12,
    date: "14 de Mayo",
    weekday: "Jueves",
    title: "Todoroki + teamLab + Roppongi",
    subtitle: "Arte, naturaleza e inmersion digital.",
    area: "Todoroki / Roppongi",
    route: [
      { from: "Ukima-Funado", to: "Shibuya", line: "JR Saikyo", duration: "30 min" },
      { from: "Shibuya", to: "Todoroki", line: "Tokyu Oimachi Line", duration: "10 min" },
    ],
    returnRoute: [
      { from: "Todoroki", to: "Shibuya", line: "Tokyu Oimachi + Den-en-toshi", duration: "20 min" },
      { from: "Shibuya", to: "Ukima-Funado", line: "JR Saikyo", duration: "31 min" },
    ],
    timeSlots: [
      {
        label: "Mañana",
        icon: "sun",
        timeRange: "9:00 - 12:00",
        activities: [
          saved("Todoroki Ravine Park", { cat: 'attraction', cost: "GRATIS", description: "Valle escondido en pleno Tokyo, con rio, cascada, templo. Muy tranquilo" }),
          saved("Kuhonbutsu Joshin-ji Temple", { cat: 'temple', cost: "GRATIS", description: "Cerca de Todoroki, templo entre árboles" }),
        ],
      },
      {
        label: "Tarde",
        icon: "sunset",
        timeRange: "13:00 - 18:00",
        activities: [
          a("Todoroki a Azabudai Hills (~30 min)", { transit: [{ from: "Todoroki", to: "Shibuya", line: "Tokyu Ōimachi" }, { from: "Shibuya", to: "Roppongi-Itchome", line: "Metro Namboku" }] }),
          saved("teamLab Borderless", { cat: 'attraction', cost: "~3.800 yen", description: "Reservar online con antelación. Ir con ropa clara. Dedicarle 2-3 horas minimo. En Azabudai Hills" }),
        ],
      },
      {
        label: "Noche",
        icon: "moon",
        timeRange: "18:00+",
        activities: [
          a("Azabudai Hills a Roppongi (~10 min)", { transit: [{ from: "Azabudai Hills", to: "Roppongi", line: "Andando" }] }),
          saved("GYOPAO Gyoza Roppongi", { cat: 'food', description: "Gyozas" }),
          nuevo("Tokyo Tower de noche", { cat: 'attraction', cost: "GRATIS (desde fuera)", description: "Andando desde Roppongi ~15 min. Iluminada es preciosa" }),
          saved("Santuario Atago", { cat: 'temple', cost: "GRATIS", description: "En una colina en Minato, tranquilo de noche" }),
        ],
      },
    ],
  },
  // ============ DIA 13 ============
  {
    dayNumber: 13,
    date: "15 de Mayo",
    weekday: "Viernes",
    title: "Kasukabe + Tiempo libre",
    subtitle: "Zona norte, cerca de casa. Último día completo.",
    area: "Kasukabe",
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo", duration: "3 min" },
      { from: "Akabane", to: "Omiya", line: "JR Utsunomiya", duration: "15 min" },
      { from: "Omiya", to: "Kasukabe", line: "Tobu Line", duration: "~30 min" },
    ],
    returnRoute: [
      { from: "Kasukabe", to: "Omiya", line: "Tobu Urban Park", duration: "22 min" },
      { from: "Omiya", to: "Akabane", line: "JR Utsunomiya", duration: "15 min" },
      { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyo", duration: "3 min" },
    ],
    timeSlots: [
      {
        label: "Mañana",
        icon: "sun",
        timeRange: "9:00 - 14:00",
        activities: [
          saved("Kasukabe", { description: "La ciudad de Crayon Shin-chan" }),
          saved("Junjo Shotengai / Pure Heart Shopping Street", { cat: 'attraction', cost: "GRATIS", description: "La calle de Shin-chan en la vida real. Estatuas y referencias" }),
          saved("LaLa garden Kasukabe", { cat: 'attraction', description: "Centro comercial" }),
          a("Barrio residencial típico japonés, muy auténtico"),
        ],
      },
      {
        label: "Tarde",
        icon: "sunset",
        timeRange: "15:00 - 18:00",
        activities: [
          a("Opciones para la tarde - ver sección de opciones"),
        ],
      },
      {
        label: "Noche",
        icon: "moon",
        timeRange: "18:00+",
        activities: [
          a("Cenar donde apetezca. Último día completo"),
          a("IMPORTANTE: Mañana despertador a las 6:30 para el vuelo. No trasnochar"),
        ],
      },
    ],
    options: [
      {
        label: "Opción A: Odaiba",
        activities: [
          nuevo("Gundam a tamaño real en DiverCity", { cost: "GRATIS (desde fuera)" }),
          nuevo("Playa artificial, vistas Rainbow Bridge", { cost: "GRATIS" }),
          a("Ruta a Odaiba", { transit: [{ from: "Ukima-Funado", to: "Osaki", line: "JR Saikyō" }, { from: "Osaki", to: "Odaiba", line: "Rinkai Line" }] }),
        ],
      },
      {
        label: "Opción B: Shimokitazawa",
        activities: [
          nuevo("Tiendas vintage, cafes indie, discos de vinilo", { cost: "GRATIS pasear" }),
          nuevo("Ambiente alternativo, muy local"),
          a("Ruta a Shimokitazawa", { transit: [{ from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyō" }, { from: "Shinjuku", to: "Shimokitazawa", line: "Odakyu" }] }),
        ],
      },
      {
        label: "Opción C: Compras finales",
        activities: [
          a("Don Quijote, Daiso, o revisitar tiendas favoritas"),
          a("Comprar souvenirs y snacks para llevar a casa"),
        ],
      },
    ],
  },
  // ============ DIA 14 ============
  {
    dayNumber: 14,
    date: "16 de Mayo",
    weekday: "Sábado",
    title: "Salida",
    subtitle: "Vuelo a las 11:00 desde Narita. Despertador a las 6:30.",
    area: "Aeropuerto",
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyo", duration: "3 min" },
      { from: "Akabane", to: "Nippori", line: "JR Keihin-Tohoku", duration: "12 min" },
      { from: "Nippori", to: "Narita", line: "Keisei Skyliner", duration: "36 min", cost: "12.62 EUR (KKday)" },
    ],
    flightInfo: {
      bookingRef: "ZNRHMT",
      segments: [
        { from: "Narita", fromCode: "NRT", to: "Zurich", toCode: "ZRH", departure: "Sab 16 May 11:00", arrival: "18:25", airline: "Swiss", flightNumber: "LX161", duration: "14h 25min" },
        { from: "Zurich", fromCode: "ZRH", to: "Valencia", toCode: "VLC", departure: "Sab 16 May 21:55", arrival: "Dom 17 May 00:05", airline: "Swiss", flightNumber: "LX2146", duration: "2h 10min" },
      ],
    },
    timeSlots: [
      {
        label: "Mañana",
        icon: "sun",
        timeRange: "6:30 - 8:00",
        activities: [
          a("Despertador a las 6:30"),
          a("Check-out del Tanpopo Inn (antes de las 10:00)"),
          a("Salir de Ukima-Funado a las ~7:30", { transit: [{ from: "Ukima-Funado", to: "Akabane", line: "JR Saikyō" }, { from: "Akabane", to: "Nippori", line: "JR Keihin-Tōhoku" }] }),
          a("Skyliner desde Nippori a Narita (~36 min)", { cost: "12.62 EUR (KKday)", transit: [{ from: "Nippori", to: "Narita", line: "Keisei Skyliner" }] }),
          a("Llegada a Narita: ~8:25"),
          a("Tip: Devolver Suica/ICOCA en maquina JR para recuperar deposito de 500 yen (o quedarsela de recuerdo)"),
        ],
      },
      {
        label: "En el aeropuerto",
        icon: "sunset",
        timeRange: "8:30 - 11:00",
        activities: [
          a("Compras ultimo minuto en las tiendas del aeropuerto"),
          a("Ekiben (bento de estacion) para el viaje"),
          a("Dulces/snacks japoneses como souvenir"),
        ],
      },
    ],
  },
];

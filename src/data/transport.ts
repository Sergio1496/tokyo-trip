export const jrSaikyoTimes = [
  { destination: "Akabane", time: "3 min", transfer: "-" },
  { destination: "Ikebukuro", time: "15 min", transfer: "Directo" },
  { destination: "Shinjuku", time: "25 min", transfer: "Directo" },
  { destination: "Shibuya", time: "30 min", transfer: "Directo" },
  { destination: "Ueno", time: "20 min", transfer: "Akabane (JR Keihin-Tohoku)" },
  { destination: "Akihabara", time: "25 min", transfer: "Akabane" },
  { destination: "Tokyo St.", time: "30 min", transfer: "Akabane" },
  { destination: "Kawagoe", time: "40 min", transfer: "Directo" },
  { destination: "Omiya", time: "15 min", transfer: "Akabane (JR Utsunomiya)" },
];

export const airportArrival = {
  title: "Llegada: Narita -> Ueno (Dia 1)",
  method: "Keisei Skyliner (ticket KKday)",
  price: "12.62 EUR/persona",
  steps: [
    "Aterrizar 9:10 -> migración/aduana (~30-45 min)",
    "Comprar/cargar Suica o ICOCA en máquinas del aeropuerto",
    "Canjear voucher KKday en mostrador Keisei",
    "Keisei Skyliner a Ueno (~41 min)",
    "Llegada a Ueno: ~10:30-10:45",
  ],
};

export const airportDeparture = {
  title: "Vuelta: Tokyo -> Narita (Dia 14)",
  method: "Keisei Skyliner (ticket KKday)",
  price: "12.62 EUR/persona",
  flightTime: "11:00",
  wakeUp: "6:30",
  leaveHome: "~7:30",
  steps: [
    "Despertador a las 6:30",
    "Ukima-Funado -> Akabane (JR Saikyo, 3 min)",
    "Akabane -> Nippori (JR Keihin-Tohoku, ~12 min)",
    "Nippori -> Narita (Skyliner, ~36 min)",
    "Llegada a Narita: ~8:25",
  ],
};

export const budgetTips = {
  transport: [
    "Suica/ICOCA para todo. Cargar en máquinas de estaciones",
    "Caminar mucho: Ueno->Asakusa, Asakusa->Akihabara, Harajuku->Shibuya (15-20 min andando)",
    "JR Saikyo directo a Ikebukuro, Shinjuku, Shibuya desde casa",
  ],
  food: [
    "Desayuno konbini: onigiri (120-180 yen) + café (150 yen) = ~300 yen",
    "Cadenas baratas: Matsuya, Yoshinoya, Sukiya -> gyudon desde 400 yen",
    "Sushi rotatorio: SUSHIRO y Uobei -> platos desde 120 yen",
    "Omoide Yokocho: yakitori desde 100-200 yen el pincho",
    "Supermercados: a partir de 19-20h descuentos del 30-50%",
    "Agua: llevar botella reutilizable, fuentes en parques",
  ],
  activities: [
    "Templos y santuarios: GRATIS (salvo jardín interior de algunos)",
    "Parques: Ueno, Yoyogi, Todoroki - todos GRATIS",
    "Mirador TMG Shinjuku planta 45: GRATIS",
    "Santuario Meiji: GRATIS",
    "Tsukiji Outer Market: GRATIS entrar",
    "Jardines Palacio Imperial Este: GRATIS",
  ],
  shopping: [
    "Don Quijote (Donki): souvenirs, snacks, todo barato",
    "Daiso / Seria / Can Do: tiendas de 100 yen (~0.60 EUR)",
    "Book Off / Hard Off: electrónica y coleccionismo de segunda mano",
    "Tax Free: compras +5.000 yen -> pedir tax free (ahorro 10%)",
  ],
};

export const dailyBudget = {
  headers: ["Concepto", "Económico", "Moderado"],
  rows: [
    { label: "Skyliner ida (KKday)", eco: 2580, mod: 2580, fixed: true },
    { label: "Skyliner vuelta (KKday)", eco: 2580, mod: 2580, fixed: true },
    { label: "JR Nippori<->Ukima (ida+vuelta)", eco: 460, mod: 460 },
    { label: "Coin lockers día 1", eco: 700, mod: 700 },
    { label: "Transporte diario (x14)", eco: 10000, mod: 18000 },
    { label: "Comida diaria (x14)", eco: 22000, mod: 56000 },
    { label: "Actividades totales", eco: 5000, mod: 12000 },
    { label: "Bus Fuji (ida y vuelta)", eco: 4500, mod: 4500 },
  ],
  note: "Sin contar alojamiento ni vuelos. Sin contar compras personales.",
};

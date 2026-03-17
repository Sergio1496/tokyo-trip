export interface Spot {
  name: string;
  type: "food" | "temple" | "attraction";
  cost: string;
  description: string;
}

export interface RouteStep {
  from: string;
  to: string;
  line: string;
  duration: string;
  cost?: string;
}

export interface Neighborhood {
  name: string;
  nameJp: string;
  description: string;
  vibe: string;
  access: string;
  walkable: boolean;
  route: RouteStep[];
  returnRoute: RouteStep[];
  spots: Spot[];
}

export const neighborhoods: Neighborhood[] = [
  {
    name: "Shimokitazawa",
    nameJp: "下北沢",
    description: "El barrio alternativo de Tokyo. Tiendas vintage, cafes indie, teatros underground.",
    vibe: "Hipster / Vintage",
    access: "Odakyu Line desde Shinjuku (1 parada, 3 min)",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyō", duration: "25 min", cost: "¥260" },
      { from: "Shinjuku", to: "Shimokitazawa", line: "Odakyu", duration: "3 min", cost: "¥130" },
    ],
    returnRoute: [
      { from: "Shimokitazawa", to: "Shinjuku", line: "Odakyu", duration: "3 min", cost: "¥130" },
      { from: "Shinjuku", to: "Ukima-Funado", line: "JR Saikyō", duration: "19 min", cost: "¥260" },
    ],
    spots: [
      { name: "Tiendas vintage de Shimokitazawa", type: "attraction", cost: "GRATIS", description: "Decenas de tiendas de ropa de segunda mano a precios ridiculos" },
      { name: "Shirube", type: "food", cost: "~800 yen", description: "Curry japones casero, porciones grandes" },
      { name: "Bear Pond Espresso", type: "food", cost: "~500 yen", description: "Uno de los mejores cafes de Tokyo" },
      { name: "Shimokitazawa Cage", type: "attraction", cost: "GRATIS", description: "Mercadillo al aire libre, artistas callejeros" },
      { name: "Village Vanguard", type: "attraction", cost: "GRATIS", description: "Tienda de curiosidades, libros raros, gadgets absurdos" },
      { name: "Tollywood", type: "attraction", cost: "GRATIS", description: "Callejon con tiendas de discos de vinilo" },
    ],
  },
  {
    name: "Koenji",
    nameJp: "高円寺",
    description: "El barrio punk de Tokyo. Tiendas de segunda mano, bares baratos, ambiente rebelde.",
    vibe: "Punk / Underground",
    access: "JR Chuo Line desde Shinjuku (7 min)",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyō", duration: "25 min", cost: "¥260" },
      { from: "Shinjuku", to: "Koenji", line: "JR Chūō", duration: "7 min", cost: "¥150" },
    ],
    returnRoute: [
      { from: "Koenji", to: "Shinjuku", line: "JR Chūō", duration: "7 min", cost: "¥150" },
      { from: "Shinjuku", to: "Ukima-Funado", line: "JR Saikyō", duration: "19 min", cost: "¥260" },
    ],
    spots: [
      { name: "Koenji Pal Shopping Street", type: "attraction", cost: "GRATIS", description: "Galeria comercial cubierta, tiendas locales" },
      { name: "Sokkyou Ramen", type: "food", cost: "~900 yen", description: "Ramen de cerdo espeso estilo Jiro" },
      { name: "Koenji Hikari Kissa", type: "food", cost: "~400 yen", description: "Kissaten (cafeteria retro) con musica jazz" },
      { name: "Tiendas de segunda mano de Koenji", type: "attraction", cost: "GRATIS", description: "Ropa vintage más barata que Shimokitazawa" },
      { name: "Templo Koenji", type: "temple", cost: "GRATIS", description: "Pequeño templo budista tranquilo" },
      { name: "Bares de Koenji", type: "food", cost: "~500 yen", description: "Izakayas diminutas y baratas, ambiente local" },
    ],
  },
  {
    name: "Jimbocho",
    nameJp: "神保町",
    description: "La ciudad de los libros. 170+ librerias, el mejor curry de Tokyo, cultura otaku vintage.",
    vibe: "Intelectual / Retro",
    access: "Metro Hanzomon/Mita/Shinjuku Line (Jimbocho Station)",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyō", duration: "3 min", cost: "¥150" },
      { from: "Akabane", to: "Nippori", line: "JR Keihin-Tōhoku", duration: "12 min", cost: "¥170" },
      { from: "Nippori", to: "Jimbocho", line: "Metro Chiyoda", duration: "15 min", cost: "¥210" },
    ],
    returnRoute: [
      { from: "Jimbocho", to: "Nippori", line: "Metro Chiyoda", duration: "15 min", cost: "¥210" },
      { from: "Nippori", to: "Akabane", line: "JR Keihin-Tōhoku", duration: "13 min", cost: "¥170" },
      { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyō", duration: "3 min", cost: "¥150" },
    ],
    spots: [
      { name: "Librerias de Jimbocho", type: "attraction", cost: "GRATIS", description: "170+ tiendas de libros, manga antiguo, mapas vintage, grabados ukiyo-e" },
      { name: "Bondy", type: "food", cost: "~1.200 yen", description: "El curry mas famoso de Jimbocho. Estilo europeo con mantequilla" },
      { name: "Kitchen Nankai", type: "food", cost: "~800 yen", description: "Katsu curry casero, colas enormes, porciones gigantes" },
      { name: "Santuario Kanda Myojin", type: "temple", cost: "GRATIS", description: "Santuario de 1.300 años, protector de Akihabara. Amuletos de tecnología" },
      { name: "Wonder Parlour", type: "food", cost: "~600 yen", description: "Kissaten clásico con pudín casero legendario" },
      { name: "@Wonder", type: "attraction", cost: "GRATIS", description: "Tienda de manga vintage, revistas retro, coleccionismo" },
    ],
  },
  {
    name: "Kagurazaka",
    nameJp: "神楽坂",
    description: "El barrio franco-japones. Callejuelas de geishas, templos escondidos, patisseries.",
    vibe: "Elegante / Escondido",
    access: "Metro Tozai Line (Kagurazaka Station) o JR Iidabashi",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Ikebukuro", line: "JR Saikyō", duration: "15 min", cost: "¥210" },
      { from: "Ikebukuro", to: "Iidabashi", line: "Metro Yūrakuchō", duration: "8 min", cost: "¥180" },
    ],
    returnRoute: [
      { from: "Iidabashi", to: "Ikebukuro", line: "Metro Yūrakuchō", duration: "8 min", cost: "¥180" },
      { from: "Ikebukuro", to: "Ukima-Funado", line: "JR Saikyō", duration: "15 min", cost: "¥210" },
    ],
    spots: [
      { name: "Callejuelas de Kagurazaka", type: "attraction", cost: "GRATIS", description: "Callejones estrechos estilo Kyoto en pleno Tokyo" },
      { name: "Santuario Akagi", type: "temple", cost: "GRATIS", description: "Santuario moderno disenado por Kengo Kuma" },
      { name: "Templo Zenkoku-ji", type: "temple", cost: "GRATIS", description: "Templo Bishamonten, protector de los guerreros" },
      { name: "Canal Cafe", type: "food", cost: "~800 yen", description: "Terraza sobre el foso del antiguo castillo de Edo" },
      { name: "Le Bretagne", type: "food", cost: "~1.000 yen", description: "Creperia bretona autentica" },
      { name: "Kimuraya", type: "food", cost: "~300 yen", description: "Panaderia japonesa tradicional, pan de melon" },
    ],
  },
  {
    name: "Ryogoku",
    nameJp: "両国",
    description: "El barrio del sumo. Chanko nabe, museos, cultura de luchadores.",
    vibe: "Tradicional / Sumo",
    access: "JR Sobu Line desde Akihabara (5 min)",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyō", duration: "3 min", cost: "¥150" },
      { from: "Akabane", to: "Akihabara", line: "JR Keihin-Tōhoku", duration: "21 min", cost: "¥230" },
      { from: "Akihabara", to: "Ryogoku", line: "JR Chūō-Sōbu", duration: "5 min", cost: "¥150" },
    ],
    returnRoute: [
      { from: "Ryogoku", to: "Akihabara", line: "JR Chūō-Sōbu", duration: "5 min", cost: "¥150" },
      { from: "Akihabara", to: "Akabane", line: "JR Keihin-Tōhoku", duration: "21 min", cost: "¥230" },
      { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyō", duration: "3 min", cost: "¥150" },
    ],
    spots: [
      { name: "Ryogoku Kokugikan (exterior)", type: "attraction", cost: "GRATIS", description: "Estadio nacional de sumo. Tienda de souvenirs de sumo" },
      { name: "Chanko Kawasaki", type: "food", cost: "~1.500 yen", description: "Chanko nabe (estofado de sumo) en restaurante de ex-luchador" },
      { name: "Edo-Tokyo Museum", type: "attraction", cost: "600 yen", description: "Historia de Tokyo desde Edo. Maquetas a escala real" },
      { name: "Jardines Kyu-Yasuda", type: "attraction", cost: "GRATIS", description: "Jardín japonés tranquilo al lado del estadio" },
      { name: "Ekoin Temple", type: "temple", cost: "GRATIS", description: "Donde se hacian los torneos de sumo antiguamente" },
      { name: "Sumida Hokusai Museum", type: "attraction", cost: "400 yen", description: "Museo del pintor de La Gran Ola. Edificio espectacular" },
    ],
  },
  {
    name: "Tsukishima",
    nameJp: "月島",
    description: "La isla del monjayaki. Comida callejera, ambiente de pueblo en medio de Tokyo.",
    vibe: "Local / Foodie",
    access: "Metro Yurakucho/Oedo Line (Tsukishima Station)",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Ikebukuro", line: "JR Saikyō", duration: "15 min", cost: "¥210" },
      { from: "Ikebukuro", to: "Tsukishima", line: "Metro Yūrakuchō", duration: "22 min", cost: "¥250" },
    ],
    returnRoute: [
      { from: "Tsukishima", to: "Ikebukuro", line: "Metro Yūrakuchō", duration: "22 min", cost: "¥250" },
      { from: "Ikebukuro", to: "Ukima-Funado", line: "JR Saikyō", duration: "15 min", cost: "¥210" },
    ],
    spots: [
      { name: "Monja Street", type: "attraction", cost: "GRATIS", description: "Calle entera de restaurantes de monjayaki (la versión de Tokyo del okonomiyaki)" },
      { name: "Tsukishima Monja Moheji", type: "food", cost: "~1.000 yen", description: "Monjayaki clásico, te lo preparan ellos" },
      { name: "Tsukuda area", type: "attraction", cost: "GRATIS", description: "Pueblo de pescadores de 400 años, casas antiguas" },
      { name: "Sumiyoshi Shrine", type: "temple", cost: "GRATIS", description: "Santuario del pueblo de pescadores" },
      { name: "Puente Kachidoki", type: "attraction", cost: "GRATIS", description: "Vistas al Rainbow Bridge y la bahia de Tokyo" },
      { name: "Tsukudani shops", type: "food", cost: "~300 yen", description: "Conservas tradicionales de pescado, dulces artesanos" },
    ],
  },
  {
    name: "Kichijoji",
    nameJp: "吉祥寺",
    description: "El barrio mas deseado de Tokyo para vivir. Parque, mercado, ambiente relajado.",
    vibe: "Relajado / Local",
    access: "JR Chuo Line desde Shinjuku (15 min)",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Shinjuku", line: "JR Saikyō", duration: "25 min", cost: "¥260" },
      { from: "Shinjuku", to: "Kichijoji", line: "JR Chūō", duration: "15 min", cost: "¥230" },
    ],
    returnRoute: [
      { from: "Kichijoji", to: "Shinjuku", line: "JR Chūō", duration: "15 min", cost: "¥230" },
      { from: "Shinjuku", to: "Ukima-Funado", line: "JR Saikyō", duration: "19 min", cost: "¥260" },
    ],
    spots: [
      { name: "Inokashira Park", type: "attraction", cost: "GRATIS", description: "Lago con barcas, santuario Benzaiten, artistas callejeros los domingos" },
      { name: "Harmonica Yokocho", type: "food", cost: "~500 yen", description: "Callejones de bares e izakayas diminutas. Yakitori desde 100 yen" },
      { name: "Satou", type: "food", cost: "~200 yen", description: "Croquetas de carne wagyu para llevar. Cola siempre, merece la pena" },
      { name: "Sun Road Shopping Street", type: "attraction", cost: "GRATIS", description: "Galeria comercial cubierta, tiendas locales" },
      { name: "Ghibli Museum (exterior)", type: "attraction", cost: "GRATIS (exterior)", description: "Si no tienes entrada, el exterior y el parque de alrededor merecen" },
      { name: "Steak House Satou", type: "food", cost: "~1.500 yen", description: "Restaurante del mismo dueno de las croquetas, carne wagyu" },
    ],
  },
  {
    name: "Naka-Meguro",
    nameJp: "中目黒",
    description: "Canal con cerezos, cafés de diseño, boutiques. El barrio trendy de Tokyo.",
    vibe: "Trendy / Diseno",
    access: "Metro Hibiya Line o Tokyu Toyoko Line (Naka-Meguro Station)",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyō", duration: "3 min", cost: "¥150" },
      { from: "Akabane", to: "Nippori", line: "JR Keihin-Tōhoku", duration: "12 min", cost: "¥170" },
      { from: "Nippori", to: "Naka-Meguro", line: "Metro Hibiya", duration: "25 min", cost: "¥250" },
    ],
    returnRoute: [
      { from: "Naka-Meguro", to: "Nippori", line: "Metro Hibiya", duration: "25 min", cost: "¥250" },
      { from: "Nippori", to: "Akabane", line: "JR Keihin-Tōhoku", duration: "13 min", cost: "¥170" },
      { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyō", duration: "3 min", cost: "¥150" },
    ],
    spots: [
      { name: "Meguro River", type: "attraction", cost: "GRATIS", description: "Paseo por el canal. Espectacular con cerezos en flor (en mayo ya no, pero sigue bonito)" },
      { name: "Starbucks Reserve Roastery", type: "food", cost: "~600 yen", description: "El Starbucks más bonito del mundo. 4 pisos, diseño japonés" },
      { name: "Onibus Coffee", type: "food", cost: "~500 yen", description: "Cafe de especialidad en un garaje reconvertido" },
      { name: "Traveler's Factory", type: "attraction", cost: "GRATIS", description: "Tienda de libretas Traveler's Notebook, papeleria japonesa" },
      { name: "Cow Books", type: "attraction", cost: "GRATIS", description: "Libreria curada minuscula, solo libros seleccionados" },
      { name: "Yakitori Blast!", type: "food", cost: "~800 yen", description: "Yakitori barato y bueno para la zona" },
    ],
  },
  {
    name: "Ningyocho",
    nameJp: "人形町",
    description: "El viejo Tokyo que no sale en las guías. Dulcerías centenarias, artesanos, zero turistas.",
    vibe: "Autentico / Retro",
    access: "Metro Hibiya/Asakusa Line (Ningyocho Station)",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyō", duration: "3 min", cost: "¥150" },
      { from: "Akabane", to: "Nippori", line: "JR Keihin-Tōhoku", duration: "12 min", cost: "¥170" },
      { from: "Nippori", to: "Ningyocho", line: "Metro Hibiya", duration: "18 min", cost: "¥210" },
    ],
    returnRoute: [
      { from: "Ningyocho", to: "Nippori", line: "Metro Hibiya", duration: "18 min", cost: "¥210" },
      { from: "Nippori", to: "Akabane", line: "JR Keihin-Tōhoku", duration: "13 min", cost: "¥170" },
      { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyō", duration: "3 min", cost: "¥150" },
    ],
    spots: [
      { name: "Amazake Yokocho", type: "attraction", cost: "GRATIS", description: "Callejon de tiendas centenarias. Amazake (bebida dulce de arroz) gratis en algunas" },
      { name: "Yanagiya Taiyaki", type: "food", cost: "~200 yen", description: "Taiyaki (pastel con forma de pez) desde 1916" },
      { name: "Santuario Suitengu", type: "temple", cost: "GRATIS", description: "Santuario protector de embarazadas y ninos" },
      { name: "Tamahide", type: "food", cost: "~1.500 yen", description: "Oyakodon (pollo y huevo sobre arroz) inventado aqui en 1891" },
      { name: "Ningyocho Karakuri Yagura", type: "attraction", cost: "GRATIS", description: "Reloj mecanico con marionetas, se activa cada hora" },
      { name: "Kotobukido", type: "food", cost: "~300 yen", description: "Ningyoyaki (pasteles con forma de muneco) desde 1917" },
    ],
  },
  {
    name: "Sangenjaya",
    nameJp: "三軒茶屋",
    description: "Barrio local con izakayas baratisimas. Donde beben los jovenes de Tokyo.",
    vibe: "Nocturno / Barato",
    access: "Tokyu Den-en-toshi Line desde Shibuya (5 min)",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Shibuya", line: "JR Saikyō", duration: "30 min", cost: "¥350" },
      { from: "Shibuya", to: "Sangenjaya", line: "Tokyu Den-en-toshi", duration: "5 min", cost: "¥140" },
    ],
    returnRoute: [
      { from: "Sangenjaya", to: "Shibuya", line: "Tokyu Den-en-toshi", duration: "5 min", cost: "¥140" },
      { from: "Shibuya", to: "Ukima-Funado", line: "JR Saikyō", duration: "31 min", cost: "¥350" },
    ],
    spots: [
      { name: "Sankaku Chitai", type: "food", cost: "~400 yen", description: "Triangulo de callejones con izakayas diminutas. Cerveza desde 300 yen" },
      { name: "Carrot Tower Mirador", type: "attraction", cost: "GRATIS", description: "Mirador gratuito en planta 26. Vistas al Monte Fuji en días claros" },
      { name: "Latin", type: "food", cost: "~700 yen", description: "Kissaten retro abierta desde 1951. Pudin casero" },
      { name: "Gyoza no Maru-Man", type: "food", cost: "~500 yen", description: "Gyozas fritas crujientes legendarias" },
      { name: "Setagaya Kannon-ji", type: "temple", cost: "GRATIS", description: "Templo tranquilo con jardín de bambú" },
      { name: "Callejones de Sangenjaya", type: "attraction", cost: "GRATIS", description: "Perderse por los callejones es la experiencia" },
    ],
  },
  {
    name: "Shibamata",
    nameJp: "柴又",
    description: "Pueblo retro dentro de Tokyo. Escenario de Tora-san. Como viajar en el tiempo.",
    vibe: "Retro / Nostalgico",
    access: "Keisei Line hasta Shibamata Station",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Akabane", line: "JR Saikyō", duration: "3 min", cost: "¥150" },
      { from: "Akabane", to: "Nippori", line: "JR Keihin-Tōhoku", duration: "12 min", cost: "¥170" },
      { from: "Nippori", to: "Takasago", line: "Keisei", duration: "15 min", cost: "¥260" },
      { from: "Takasago", to: "Shibamata", line: "Keisei Kanamachi", duration: "3 min", cost: "¥140" },
    ],
    returnRoute: [
      { from: "Shibamata", to: "Takasago", line: "Keisei Kanamachi", duration: "3 min", cost: "¥140" },
      { from: "Takasago", to: "Nippori", line: "Keisei", duration: "15 min", cost: "¥260" },
      { from: "Nippori", to: "Akabane", line: "JR Keihin-Tōhoku", duration: "13 min", cost: "¥170" },
      { from: "Akabane", to: "Ukima-Funado", line: "JR Saikyō", duration: "3 min", cost: "¥150" },
    ],
    spots: [
      { name: "Taishakuten Sando", type: "attraction", cost: "GRATIS", description: "Calle comercial retro con tiendas de dango, sembei, dulces" },
      { name: "Templo Taishakuten", type: "temple", cost: "400 yen (galería de tallas)", description: "Templo con tallas de madera increibles. Jardin japones" },
      { name: "Estatua de Tora-san", type: "attraction", cost: "GRATIS", description: "Protagonista de la serie de peliculas más larga de la historia" },
      { name: "Takagi-ya", type: "food", cost: "~300 yen", description: "Dango (bolitas de mochi) asadas con salsa. Desde hace generaciones" },
      { name: "Yamamoto-tei", type: "attraction", cost: "100 yen", description: "Mansión histórica con jardín japonés precioso" },
      { name: "Rio Edogawa", type: "attraction", cost: "GRATIS", description: "Paseo por la ribera, se puede cruzar en barca de madera (200 yen)" },
    ],
  },
  {
    name: "Togoshi-Ginza",
    nameJp: "戸越銀座",
    description: "La calle comercial más larga de Tokyo (1.3km). Comida callejera baratisima.",
    vibe: "Comida callejera / Local",
    access: "Tokyu Ikegami Line desde Gotanda (3 min)",
    walkable: true,
    route: [
      { from: "Ukima-Funado", to: "Osaki", line: "JR Saikyō", duration: "28 min", cost: "¥330" },
      { from: "Osaki", to: "Gotanda", line: "JR Yamanote", duration: "2 min", cost: "¥150" },
      { from: "Gotanda", to: "Togoshi-Ginza", line: "Tokyu Ikegami", duration: "3 min", cost: "¥140" },
    ],
    returnRoute: [
      { from: "Togoshi-Ginza", to: "Gotanda", line: "Tokyu Ikegami", duration: "3 min", cost: "¥140" },
      { from: "Gotanda", to: "Osaki", line: "JR Yamanote", duration: "2 min", cost: "¥150" },
      { from: "Osaki", to: "Ukima-Funado", line: "JR Saikyō", duration: "28 min", cost: "¥330" },
    ],
    spots: [
      { name: "Togoshi-Ginza Shopping Street", type: "attraction", cost: "GRATIS", description: "1.3km de tiendas, 400+ negocios. Zero turistas" },
      { name: "Togoshi-Ginza Croquette", type: "food", cost: "~100 yen", description: "Croquetas a 60-100 yen cada una. Hay que probar varias" },
      { name: "Tofu-ya", type: "food", cost: "~200 yen", description: "Donuts de tofu recien hechos" },
      { name: "Onsen Togoshi-Ginza", type: "attraction", cost: "~500 yen", description: "Bano publico (sento) tradicional. Experiencia local autentica" },
      { name: "Togoshi Hachiman Shrine", type: "temple", cost: "GRATIS", description: "Santuario local tranquilo" },
      { name: "Yakitori callejero", type: "food", cost: "~100 yen/pincho", description: "Pinchos de pollo por 100 yen en puestos de la calle" },
    ],
  },
];

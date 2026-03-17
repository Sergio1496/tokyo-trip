export const tripInfo = {
  title: "Tokyo 2026",
  dates: "3 - 16 Mayo 2026",
  travelers: "2 adultos",
  accommodation: {
    name: "Tanpopo Inn",
    address: "浮間寮 さくら・浮間, Tokio, Japon",
    station: "Ukima-Funado (JR Saikyo Line)",
    checkIn: "16:00 - 23:30",
    checkOut: "00:00 - 10:00",
    nights: 13,
  },
  flights: {
    outbound: {
      bookingRef: "ZNRHMT",
      segments: [
        { route: "VLC -> ZRH", time: "Sab 2 May 06:00 - 08:10", flight: "Swiss LX2147", duration: "2h 10min" },
        { route: "ZRH -> NRT", time: "Sab 2 May 13:05 - Dom 3 May 09:10", flight: "Swiss LX160", duration: "13h 05min" },
      ],
    },
    returnFlight: {
      bookingRef: "ZNRHMT",
      segments: [
        { route: "NRT -> ZRH", time: "Sab 16 May 11:00 - 18:25", flight: "Swiss LX161", duration: "14h 25min" },
        { route: "ZRH -> VLC", time: "Sab 16 May 21:55 - Dom 17 May 00:05", flight: "Swiss LX2146", duration: "2h 10min" },
      ],
    },
  },
};

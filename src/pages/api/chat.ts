export const prerender = false;

import type { APIRoute } from "astro";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { tripInfo } from "../../data/base";
import { days } from "../../data/itinerary";
import { jrSaikyoTimes, airportArrival, airportDeparture, budgetTips, dailyBudget } from "../../data/transport";
import { neighborhoods } from "../../data/neighborhoods";
import { stationCoords } from "../../data/stations";

function buildSystemPrompt(): string {
  const tripContext = `
INFORMACION DEL VIAJE:
- Titulo: ${tripInfo.title}
- Fechas: ${tripInfo.dates}
- Viajeros: ${tripInfo.travelers}
- Alojamiento: ${tripInfo.accommodation.name}
- Direccion: ${tripInfo.accommodation.address}
- Estacion base: ${tripInfo.accommodation.station}
- Check-in: ${tripInfo.accommodation.checkIn}
- Check-out: ${tripInfo.accommodation.checkOut}
- Noches: ${tripInfo.accommodation.nights}

VUELOS:
Ida:
${tripInfo.flights.outbound.segments.map(s => `  ${s.route}: ${s.time} (${s.flight}, ${s.duration})`).join("\n")}
  Ref: ${tripInfo.flights.outbound.bookingRef}
Vuelta:
${tripInfo.flights.returnFlight.segments.map(s => `  ${s.route}: ${s.time} (${s.flight}, ${s.duration})`).join("\n")}
  Ref: ${tripInfo.flights.returnFlight.bookingRef}
`;

  const transportContext = `
TIEMPOS DESDE UKIMA-FUNADO (JR Saikyo Line):
${jrSaikyoTimes.map(t => `- ${t.destination}: ${t.time} ${t.transfer !== "-" ? `(transbordo en ${t.transfer})` : "(directo)"}`).join("\n")}

LLEGADA AEROPUERTO:
${airportArrival.title} - ${airportArrival.method} (${airportArrival.price})
Pasos: ${airportArrival.steps.join(" → ")}

SALIDA AEROPUERTO:
${airportDeparture.title} - ${airportDeparture.method} (${airportDeparture.price})
Vuelo: ${airportDeparture.flightTime} | Despertar: ${airportDeparture.wakeUp} | Salir: ${airportDeparture.leaveHome}
Pasos: ${airportDeparture.steps.join(" → ")}
`;

  const tipsContext = `
TIPS TRANSPORTE: ${budgetTips.transport.join(" | ")}
TIPS COMIDA: ${budgetTips.food.join(" | ")}
ACTIVIDADES GRATIS: ${budgetTips.activities.join(" | ")}
TIPS COMPRAS: ${budgetTips.shopping.join(" | ")}

PRESUPUESTO DIARIO POR PERSONA:
${dailyBudget.rows.map(r => `- ${r.label}: eco=${r.eco} yen, mod=${r.mod} yen`).join("\n")}
Nota: ${dailyBudget.note}
`;

  const itineraryContext = days.map(day => {
    const slots = day.timeSlots.map(slot => {
      const acts = slot.activities.map(act => {
        let line = `    - ${act.name}`;
        if (act.saved) line += " [GUARDADO en Google Maps]";
        if (act.isNew) line += " [NUEVO]";
        if (act.cost) line += ` (${act.cost})`;
        if (act.description) line += ` - ${act.description}`;
        if (act.tips?.length) line += ` Tips: ${act.tips.join(", ")}`;
        if (act.subItems?.length) {
          line += "\n" + act.subItems.map(sub => {
            let subLine = `      - ${sub.name}`;
            if (sub.cost) subLine += ` (${sub.cost})`;
            if (sub.description) subLine += ` - ${sub.description}`;
            return subLine;
          }).join("\n");
        }
        return line;
      }).join("\n");
      return `  ${slot.label} (${slot.timeRange}):\n${acts}`;
    }).join("\n");

    const route = day.route.map(r => `${r.from} → ${r.to} (${r.line}, ${r.duration}${r.cost ? `, ${r.cost}` : ""})`).join(" → ");
    const returnRoute = day.returnRoute?.map(r => `${r.from} → ${r.to} (${r.line}, ${r.duration})`).join(" → ") || "";

    let dayStr = `DIA ${day.dayNumber} - ${day.weekday} ${day.date}: ${day.title}
  ${day.subtitle}
  Zona: ${day.area}
  Ruta ida: ${route}`;
    if (returnRoute) dayStr += `\n  Ruta vuelta: ${returnRoute}`;
    if (day.flightInfo) {
      dayStr += `\n  Vuelo: ${day.flightInfo.segments.map(s => `${s.from}(${s.fromCode}) → ${s.to}(${s.toCode}) ${s.departure}-${s.arrival} ${s.airline} ${s.flightNumber} (${s.duration})`).join(" | ")}`;
    }
    if (day.options?.length) {
      dayStr += "\n  OPCIONES TARDE:";
      day.options.forEach(opt => {
        dayStr += `\n    ${opt.label}: ${opt.activities.map(a => a.name).join(", ")}`;
      });
    }
    dayStr += `\n${slots}`;
    return dayStr;
  }).join("\n\n");

  const neighborhoodContext = neighborhoods.map(n => {
    const route = n.route.map(r => `${r.from}→${r.to} (${r.line}, ${r.duration}, ${r.cost})`).join(" → ");
    const spots = n.spots.map(s => `  - ${s.name} [${s.type}] ${s.cost} - ${s.description}`).join("\n");
    return `${n.name} (${n.nameJp}) - ${n.description}
  Vibe: ${n.vibe} | Acceso: ${n.access}
  Ruta desde casa: ${route}
  Lugares:\n${spots}`;
  }).join("\n\n");

  return `Eres el asistente personal de viaje de Sergio y su acompanante para su viaje a Tokyo del 3 al 16 de mayo de 2026 (14 dias).

REGLAS:
- Responde SIEMPRE en espanol
- Se conciso y directo, como un amigo que conoce bien Tokyo
- Usa los datos reales del viaje: precios en yenes, tiempos de tren exactos, nombres de sitios
- Si te preguntan por transporte, da la ruta completa con lineas de tren, transbordos y tiempos
- Si te preguntan costes, da precios en yenes
- Si no tienes la info exacta del viaje, di que no lo tienes pero da tu mejor estimacion
- Puedes sugerir alternativas o mejoras al plan si te lo piden
- Usa emojis con moderacion para que sea facil de leer
- No repitas toda la info, responde solo lo que preguntan
- Si preguntan "que hacemos hoy" o similar, mira el dia correspondiente del itinerario
- PRECIOS DE TRANSPORTE: Los precios de tren/metro/bus incluidos aqui son estimaciones de referencia. Cuando te pregunten especificamente por precios de transporte, usa Google Search para verificar las tarifas actualizadas. Indica si el precio viene de busqueda web o de los datos de referencia.
- Si no encuentras un precio actualizado en la busqueda, usa el precio de referencia pero aclara que es una estimacion que conviene verificar.

${tripContext}
${transportContext}
${tipsContext}

=== ITINERARIO DIA A DIA ===
${itineraryContext}

=== BARRIOS EXTRA PARA DESCUBRIR ===
${neighborhoodContext}

=== COORDENADAS DE ESTACIONES (para referencias de distancia) ===
${Object.entries(stationCoords).map(([name, [lat, lng]]) => `${name}: ${lat},${lng}`).join("\n")}
`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

export const POST: APIRoute = async ({ request }) => {
  const geminiKey = import.meta.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), { status: 500 });
  }

  try {
    const { messages } = await request.json() as {
      messages: { role: "user" | "model"; content: string }[];
    };

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools: [
        { google_search: {} } as any,
      ],
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const streamResult = await chat.sendMessageStream(lastMessage.content);

    // Stream response as SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }

          // Send grounding sources at the end
          const response = await streamResult.response;
          const candidate = response.candidates?.[0];
          const sources = (candidate as any)?.groundingMetadata?.groundingChunks
            ?.map((c: any) => c.web)
            .filter(Boolean) ?? [];

          if (sources.length > 0) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`));
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("Gemini error:", err);
    return new Response(JSON.stringify({ error: err.message || "Error calling Gemini" }), { status: 500 });
  }
};

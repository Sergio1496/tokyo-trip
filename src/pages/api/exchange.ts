import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?base=JPY&symbols=EUR");
    const data = await res.json();
    const rate = data.rates?.EUR;
    if (!rate) throw new Error("No rate found");

    return new Response(JSON.stringify({
      rate,
      date: data.date,
      examples: {
        "500": Math.round(500 * rate * 100) / 100,
        "1000": Math.round(1000 * rate * 100) / 100,
        "5000": Math.round(5000 * rate * 100) / 100,
        "10000": Math.round(10000 * rate * 100) / 100,
      },
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

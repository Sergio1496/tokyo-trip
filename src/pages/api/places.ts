import type { APIRoute } from "astro";

export const prerender = false;

const SERPAPI_KEY = import.meta.env.SERPAPI_KEY || process.env.SERPAPI_KEY;

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get("q");
  if (!q) {
    return new Response(JSON.stringify({ error: "Missing q parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const serpUrl = new URL("https://serpapi.com/search.json");
    serpUrl.searchParams.set("engine", "google_maps");
    serpUrl.searchParams.set("q", q);
    serpUrl.searchParams.set("type", "search");
    serpUrl.searchParams.set("hl", "es");
    serpUrl.searchParams.set("api_key", SERPAPI_KEY || "");

    const res = await fetch(serpUrl.toString());
    const data = await res.json();

    const results = (data.local_results || []).slice(0, 6).map((r: any) => ({
      title: r.title,
      rating: r.rating,
      reviews: r.reviews,
      price: r.price,
      type: r.type,
      address: r.address,
      place_id: r.place_id,
    }));

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

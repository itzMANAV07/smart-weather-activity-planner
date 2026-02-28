import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { location, weather } = await req.json();

    if (!location || !weather) {
      throw new Error("Location and weather data are required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiPrompt = `Based on weather in ${location}: ${weather.temperature}°C, ${weather.condition}, ${weather.humidity}% humidity, ${weather.windSpeed} km/h wind, ${weather.rainChance}% rain chance, AQI ${weather.aqi}, UV ${weather.uvIndex}. Generate 6 creative activity recommendations. For each provide title, description (2-3 sentences), category (Indoor/Outdoor/Sports/Cultural/Food & Dining/Entertainment). Respond as JSON array with "title", "description", "category" fields only.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a weather-based activity planner. Always respond with valid JSON arrays." },
          { role: "user", content: aiPrompt },
        ],
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let activities = [];

    try {
      const content = aiData.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) activities = JSON.parse(jsonMatch[0]);
    } catch (_e) {
      // fallback
    }

    if (activities.length === 0) {
      activities = [
        { title: "Explore Outdoors", description: `Enjoy the ${weather.condition.toLowerCase()} weather at ${weather.temperature}°C.`, category: "Outdoor" },
        { title: "Visit a Museum", description: "Perfect for any weather. Discover local art and history.", category: "Cultural" },
        { title: "Local Dining", description: "Try a new restaurant or café nearby.", category: "Food & Dining" },
      ];
    }

    return new Response(JSON.stringify({ activities }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

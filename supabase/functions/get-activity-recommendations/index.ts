import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getCondition(main: string, desc: string): string {
  const m = main.toLowerCase();
  const d = desc.toLowerCase();
  if (m.includes("rain")) return d.includes("light") ? "Light Rain" : d.includes("heavy") ? "Heavy Rain" : "Rain";
  if (m.includes("snow")) return "Snow";
  if (m.includes("thunder")) return "Thunderstorm";
  if (m.includes("cloud")) return d.includes("few") || d.includes("scattered") ? "Partly Cloudy" : "Cloudy";
  if (m.includes("clear")) return "Sunny";
  if (m.includes("mist") || m.includes("fog") || m.includes("haze")) return "Foggy";
  return "Partly Cloudy";
}

function aqiToUS(index: number): { aqi: number; category: string } {
  const map: Record<number, { aqi: number; category: string }> = {
    1: { aqi: 25, category: "Good" },
    2: { aqi: 75, category: "Moderate" },
    3: { aqi: 125, category: "Unhealthy for Sensitive Groups" },
    4: { aqi: 175, category: "Unhealthy" },
    5: { aqi: 250, category: "Very Unhealthy" },
  };
  return map[index] || { aqi: 50, category: "Moderate" };
}

function uvCategory(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    if (!location) throw new Error("Location is required");

    const OPENWEATHER_API_KEY = "8ae4500adfa5be07e29890719e216cc0";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!OPENWEATHER_API_KEY) throw new Error("OPENWEATHER_API_KEY is not configured");

    // Geocode
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    const geoData = await geoRes.json();
    if (!geoData || geoData.length === 0) throw new Error("Location not found");
    const { lat, lon } = geoData[0];

    // Fetch weather, forecast, AQI in parallel
    const [weatherRes, forecastRes, aqiRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`),
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();
    const aqiData = await aqiRes.json();

    // Current weather
    const temperature = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const condition = getCondition(weatherData.weather?.[0]?.main || "", weatherData.weather?.[0]?.description || "");
    const humidity = weatherData.main.humidity;
    const windSpeed = Math.round(weatherData.wind.speed * 3.6);
    const visibility = Math.round((weatherData.visibility || 10000) / 1000);
    const pressure = weatherData.main.pressure;
    const clouds = weatherData.clouds?.all || 0;
    const hasRain = condition.toLowerCase().includes("rain");
    const rainChance = Math.round(hasRain ? Math.min(90, 50 + clouds / 2) : Math.min(30, clouds / 3));

    const sunrise = weatherData.sys?.sunrise
      ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      : "6:00 AM";
    const sunset = weatherData.sys?.sunset
      ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      : "6:00 PM";

    const aqiIndex = aqiData?.list?.[0]?.main?.aqi || 2;
    const { aqi, category: aqiCategory } = aqiToUS(aqiIndex);
    const uvIndex = Math.min(11, Math.max(1, Math.round(8 - clouds / 15)));
    const uvCat = uvCategory(uvIndex);

    const weather = {
      temperature, feelsLike, condition, humidity, windSpeed, visibility, pressure,
      rainChance, aqi, aqiCategory, uvIndex, uvCategory: uvCat, sunrise, sunset,
    };

    // 5-day forecast
    const dailyMap = new Map<string, any>();
    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000);
      const key = date.toDateString();
      const hour = date.getHours();
      if (!dailyMap.has(key) || Math.abs(hour - 12) < Math.abs(dailyMap.get(key).hour - 12)) {
        dailyMap.set(key, { dt: item.dt, hour, temp_max: item.main.temp_max, temp_min: item.main.temp_min, weather: item.weather, pop: item.pop || 0 });
      }
    }

    const forecasts = Array.from(dailyMap.values()).slice(0, 5).map((item: any) => {
      const date = new Date(item.dt * 1000);
      const cond = getCondition(item.weather?.[0]?.main || "", item.weather?.[0]?.description || "");
      const rc = Math.round((item.pop || 0) * 100);
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        tempHigh: Math.round(item.temp_max),
        tempLow: Math.round(item.temp_min),
        condition: cond,
        rainChance: rc,
        needsUmbrella: rc > 30 || cond.toLowerCase().includes("rain"),
      };
    });

    // Hourly forecast
    const hourlyForecasts = forecastData.list.slice(0, 8).map((item: any) => {
      const date = new Date(item.dt * 1000);
      const cond = getCondition(item.weather?.[0]?.main || "", item.weather?.[0]?.description || "");
      return {
        time: date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
        temp: Math.round(item.main.temp),
        condition: cond,
        rainChance: Math.round((item.pop || 0) * 100),
      };
    });

    // Alerts
    const alerts: any[] = [];
    if (weather.rainChance > 70) alerts.push({ type: "rain", severity: "warning", title: "Heavy Rain Expected", description: `High chance of rain (${weather.rainChance}%). Bring an umbrella.` });
    if (weather.windSpeed > 25) alerts.push({ type: "wind", severity: weather.windSpeed > 35 ? "severe" : "warning", title: "Strong Winds", description: `Wind speeds of ${weather.windSpeed} km/h expected.` });
    if (weather.temperature > 30) alerts.push({ type: "temperature", severity: "warning", title: "Warm Weather", description: `Temperature reaching ${weather.temperature}°C. Stay hydrated.` });
    if (weather.temperature < 5) alerts.push({ type: "temperature", severity: "warning", title: "Cold Conditions", description: `Temperature at ${weather.temperature}°C. Dress warmly.` });

    // Health notifications
    const healthNotifications: any[] = [];
    if (weather.aqi > 100) healthNotifications.push({ type: "aqi", severity: weather.aqi > 150 ? "alert" : "warning", title: "Poor Air Quality Alert", message: `AQI is ${weather.aqi} (${weather.aqiCategory}).`, bestWindow: weather.aqi < 150 ? "Early morning (6-8 AM)" : null });
    if (weather.uvIndex >= 6) healthNotifications.push({ type: "uv", severity: weather.uvIndex >= 8 ? "alert" : "warning", title: `${weather.uvCategory} UV Index`, message: `UV Index is ${weather.uvIndex}. Wear SPF 30+ sunscreen.`, bestWindow: "Before 10 AM or after 4 PM" });

    const optimalWindows: any[] = [];
    if (weather.aqi <= 100 && weather.uvIndex < 6 && weather.temperature >= 15 && weather.temperature <= 25) {
      optimalWindows.push({ type: "fitness", title: "Ideal Workout Window", message: `Perfect conditions for outdoor activities.`, timeWindow: "Current conditions optimal for 2-3 hours" });
    }

    // Best time slots
    const timeWindows = [
      { time: "Early Morning (6–8 AM)", factor: 0.7 },
      { time: "Morning (8–10 AM)", factor: 0.8 },
      { time: "Midday (10 AM–1 PM)", factor: 1.1 },
      { time: "Afternoon (1–4 PM)", factor: 1.2 },
      { time: "Evening (4–7 PM)", factor: 0.9 },
      { time: "Night (7–9 PM)", factor: 0.75 },
    ];
    const bestTimeSlots = timeWindows.map(w => {
      const est = Math.round(aqi * w.factor);
      const cat = est <= 50 ? "Good" : est <= 100 ? "Moderate" : est <= 150 ? "Unhealthy for Sensitive Groups" : "Unhealthy";
      const rec = est <= 50 ? "Excellent – great for all outdoor activities." : est <= 100 ? "Acceptable – suitable for most people." : est <= 150 ? "Sensitive groups should limit outdoor exertion." : "Avoid outdoor activities if possible.";
      return { time: w.time, aqi: est, aqiCategory: cat, recommendation: rec };
    }).sort((a, b) => a.aqi - b.aqi);

    // AI activity recommendations
    const aiPrompt = `Based on weather in ${location}: ${temperature}°C, ${condition}, ${humidity}% humidity, ${windSpeed} km/h wind, ${rainChance}% rain chance, AQI ${aqi}, UV ${uvIndex}. Generate 6 creative activity recommendations. For each provide title, description (2-3 sentences), category (Indoor/Outdoor/Sports/Cultural/Food & Dining/Entertainment). Respond as JSON array with "title", "description", "category" fields only.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a weather-based activity planner. Always respond with valid JSON arrays." },
          { role: "user", content: aiPrompt },
        ],
        temperature: 0.8,
      }),
    });

    let activities = [];
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      try {
        const content = aiData.choices[0].message.content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) activities = JSON.parse(jsonMatch[0]);
      } catch (_e) { /* fallback below */ }
    }

    if (activities.length === 0) {
      activities = [
        { title: "Explore Outdoors", description: `Enjoy the ${condition.toLowerCase()} weather at ${temperature}°C.`, category: "Outdoor" },
        { title: "Visit a Museum", description: "Perfect for any weather. Discover local art and history.", category: "Cultural" },
        { title: "Local Dining", description: "Try a new restaurant or café nearby.", category: "Food & Dining" },
      ];
    }

    return new Response(
      JSON.stringify({ weather, activities, forecasts, hourlyForecasts, alerts, healthNotifications, optimalWindows, bestTimeSlots }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: msg }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fetch real weather data from OpenWeatherMap
async function fetchWeatherData(location: string) {
  const OPENWEATHER_API_KEY = '8ae4500adfa5be07e29890719e216cc0';

  try {
    // First, geocode the location to get coordinates
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!geoResponse.ok) {
      console.error('Geocoding error:', geoResponse.status);
      return null;
    }
    
    const geoData = await geoResponse.json();
    if (!geoData || geoData.length === 0) {
      console.log('Location not found:', location);
      return null;
    }
    
    const { lat, lon } = geoData[0];
    console.log(`Geocoded ${location} to lat: ${lat}, lon: ${lon}`);
    
    // Fetch current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!weatherResponse.ok) {
      console.error('Weather API error:', weatherResponse.status);
      return null;
    }
    
    const weatherData = await weatherResponse.json();
    
    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!forecastResponse.ok) {
      console.error('Forecast API error:', forecastResponse.status);
      return null;
    }
    
    const forecastData = await forecastResponse.json();
    
    // Fetch air quality data
    const aqiResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    
    let aqiData = null;
    if (aqiResponse.ok) {
      aqiData = await aqiResponse.json();
    }
    
    // Fetch UV index from One Call API (if available)
    const uvResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    
    let uvData = null;
    if (uvResponse.ok) {
      uvData = await uvResponse.json();
    }
    
    return { weatherData, forecastData, aqiData, uvData, lat, lon };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Convert OpenWeatherMap condition to simple condition string
function getConditionFromWeather(weather: any): string {
  const main = weather?.weather?.[0]?.main?.toLowerCase() || '';
  const description = weather?.weather?.[0]?.description?.toLowerCase() || '';
  
  if (main.includes('rain') || description.includes('rain')) {
    if (description.includes('light')) return 'Light Rain';
    if (description.includes('heavy')) return 'Heavy Rain';
    return 'Rain';
  }
  if (main.includes('snow')) return 'Snow';
  if (main.includes('thunder') || main.includes('storm')) return 'Thunderstorm';
  if (main.includes('cloud')) {
    if (description.includes('few') || description.includes('scattered')) return 'Partly Cloudy';
    return 'Cloudy';
  }
  if (main.includes('clear')) return 'Sunny';
  if (main.includes('mist') || main.includes('fog') || main.includes('haze')) return 'Foggy';
  return 'Partly Cloudy';
}

// Get AQI category from index (OpenWeatherMap uses 1-5 scale)
function getAqiCategory(aqiIndex: number): { aqi: number; category: string } {
  // Convert OpenWeatherMap 1-5 scale to US AQI approximate
  const aqiMapping: { [key: number]: { aqi: number; category: string } } = {
    1: { aqi: 25, category: 'Good' },
    2: { aqi: 75, category: 'Moderate' },
    3: { aqi: 125, category: 'Unhealthy for Sensitive Groups' },
    4: { aqi: 175, category: 'Unhealthy' },
    5: { aqi: 250, category: 'Very Unhealthy' },
  };
  return aqiMapping[aqiIndex] || { aqi: 50, category: 'Moderate' };
}

// Get UV category
function getUvCategory(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    console.log('Processing request for location:', location);

    if (!location) {
      throw new Error('Location is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Try to fetch real weather data
    const realWeatherData = await fetchWeatherData(location);
    
    let weather;
    let forecasts;
    let hourlyForecasts: { time: string; temp: number; condition: string; rainChance: number; }[] = [];
    
    if (realWeatherData) {
      const { weatherData, forecastData, aqiData, uvData } = realWeatherData;
      
      console.log('Using real weather data from OpenWeatherMap');
      
      // Extract current weather
      const temperature = Math.round(weatherData.main.temp);
      const feelsLike = Math.round(weatherData.main.feels_like);
      const condition = getConditionFromWeather(weatherData);
      const humidity = weatherData.main.humidity;
      const windSpeed = Math.round(weatherData.wind.speed * 3.6); // Convert m/s to km/h
      const visibility = Math.round((weatherData.visibility || 10000) / 1000); // Convert to km
      const pressure = weatherData.main.pressure;
      
      // Extract sunrise and sunset times
      const sunriseTimestamp = weatherData.sys?.sunrise;
      const sunsetTimestamp = weatherData.sys?.sunset;
      const sunrise = sunriseTimestamp 
        ? new Date(sunriseTimestamp * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : '6:00 AM';
      const sunset = sunsetTimestamp 
        ? new Date(sunsetTimestamp * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : '6:00 PM';
      
      // Calculate rain chance from clouds and weather
      const clouds = weatherData.clouds?.all || 0;
      const hasRain = condition.toLowerCase().includes('rain');
      const rainChance = hasRain ? Math.min(90, 50 + clouds / 2) : Math.min(30, clouds / 3);
      
      // Get AQI
      const aqiIndex = aqiData?.list?.[0]?.main?.aqi || 2;
      const { aqi, category: aqiCategory } = getAqiCategory(aqiIndex);
      
      // Get UV Index (use estimate if not available)
      const uvIndex = uvData?.value || Math.min(11, Math.max(1, Math.round(8 - clouds / 15)));
      const uvCategory = getUvCategory(uvIndex);
      
      weather = {
        temperature,
        feelsLike,
        condition,
        humidity,
        windSpeed,
        visibility,
        pressure,
        rainChance: Math.round(rainChance),
        aqi,
        aqiCategory,
        uvIndex,
        uvCategory,
        sunrise,
        sunset,
      };
      
      // Process 5-day forecast - get one forecast per day at noon
      const dailyForecasts = new Map();
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        const hour = date.getHours();
        
        // Prefer noon forecasts (12:00)
        if (!dailyForecasts.has(dateKey) || Math.abs(hour - 12) < Math.abs(dailyForecasts.get(dateKey).hour - 12)) {
          dailyForecasts.set(dateKey, {
            dt: item.dt,
            hour,
            temp_max: item.main.temp_max,
            temp_min: item.main.temp_min,
            weather: item.weather,
            pop: item.pop || 0,
          });
        }
      });
      
      forecasts = Array.from(dailyForecasts.values()).slice(0, 5).map((item: any) => {
        const date = new Date(item.dt * 1000);
        const condition = getConditionFromWeather({ weather: item.weather });
        const rainChance = Math.round((item.pop || 0) * 100);
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          tempHigh: Math.round(item.temp_max),
          tempLow: Math.round(item.temp_min),
          condition,
          rainChance,
          needsUmbrella: rainChance > 30 || condition.toLowerCase().includes('rain'),
        };
      });
      
      // Process hourly forecast (next 12 hours from the 3-hour intervals)
      hourlyForecasts = forecastData.list.slice(0, 8).map((item: any) => {
        const date = new Date(item.dt * 1000);
        const condition = getConditionFromWeather({ weather: item.weather });
        const rainChance = Math.round((item.pop || 0) * 100);
        
        return {
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temp: Math.round(item.main.temp),
          condition,
          rainChance,
        };
      });
      
    } else {
      console.log('Using mock weather data');
      
      // Fallback to mock data
      const mockTemp = Math.floor(Math.random() * 15) + 15;
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const rainChance = condition === 'Light Rain' ? Math.floor(Math.random() * 50) + 30 : Math.floor(Math.random() * 30);
      
      const aqi = Math.floor(Math.random() * 200) + 10;
      const aqiCategory = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : aqi <= 150 ? 'Unhealthy for Sensitive Groups' : aqi <= 200 ? 'Unhealthy' : 'Very Unhealthy';
      
      const uvIndex = Math.floor(Math.random() * 12);
      const uvCategory = getUvCategory(uvIndex);
      
      weather = {
        temperature: mockTemp,
        feelsLike: mockTemp + Math.floor(Math.random() * 4) - 2,
        condition,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        visibility: Math.floor(Math.random() * 5) + 5,
        pressure: Math.floor(Math.random() * 30) + 1000,
        rainChance,
        aqi,
        aqiCategory,
        uvIndex,
        uvCategory,
        sunrise: '6:30 AM',
        sunset: '6:45 PM',
      };
      
      forecasts = Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayTemp = mockTemp + Math.floor(Math.random() * 10) - 5;
        const dayCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const dayRainChance = dayCondition === 'Light Rain' ? Math.floor(Math.random() * 50) + 30 : Math.floor(Math.random() * 30);
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          tempHigh: dayTemp + 3,
          tempLow: dayTemp - 3,
          condition: dayCondition,
          rainChance: dayRainChance,
          needsUmbrella: dayRainChance > 30,
        };
      });
      
      // Mock hourly forecasts
      hourlyForecasts = Array.from({ length: 8 }, (_, i) => {
        const date = new Date();
        date.setHours(date.getHours() + i * 3);
        const hourTemp = mockTemp + Math.floor(Math.random() * 6) - 3;
        const hourCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const hourRainChance = hourCondition === 'Light Rain' ? Math.floor(Math.random() * 50) + 30 : Math.floor(Math.random() * 30);
        
        return {
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temp: hourTemp,
          condition: hourCondition,
          rainChance: hourRainChance,
        };
      });
    }

    // Generate weather alerts
    const alerts = [];
    
    if (weather.rainChance > 70) {
      alerts.push({
        type: 'rain',
        severity: 'warning',
        title: 'Heavy Rain Expected',
        description: `High chance of rain (${weather.rainChance}%). Bring an umbrella and plan for wet conditions.`,
      });
    }
    
    if (weather.windSpeed > 25) {
      alerts.push({
        type: 'wind',
        severity: weather.windSpeed > 35 ? 'severe' : 'warning',
        title: 'Strong Winds',
        description: `Wind speeds of ${weather.windSpeed} km/h expected. Secure loose outdoor items.`,
      });
    }
    
    if (weather.temperature > 30) {
      alerts.push({
        type: 'temperature',
        severity: 'warning',
        title: 'Warm Weather',
        description: `Temperature reaching ${weather.temperature}°C. Stay hydrated and limit outdoor exposure during peak hours.`,
      });
    }
    
    if (weather.temperature < 5) {
      alerts.push({
        type: 'temperature',
        severity: 'warning',
        title: 'Cold Conditions',
        description: `Temperature at ${weather.temperature}°C. Dress warmly for outdoor activities.`,
      });
    }

    console.log('Generated alerts:', alerts.length);

    // Generate health notifications based on conditions
    const healthNotifications = [];
    
    if (weather.aqi > 100) {
      healthNotifications.push({
        type: 'aqi',
        severity: weather.aqi > 150 ? 'alert' : 'warning',
        title: 'Poor Air Quality Alert',
        message: `AQI is ${weather.aqi} (${weather.aqiCategory}). ${weather.aqi > 150 ? 'Avoid outdoor activities. Stay indoors with air filtration.' : 'Limit prolonged outdoor activities, especially for sensitive groups.'}`,
        bestWindow: weather.aqi < 150 ? 'Early morning (6-8 AM) typically has better air quality' : null
      });
    }
    
    if (weather.uvIndex >= 6) {
      healthNotifications.push({
        type: 'uv',
        severity: weather.uvIndex >= 8 ? 'alert' : 'warning',
        title: `${weather.uvCategory} UV Index`,
        message: `UV Index is ${weather.uvIndex}. Wear SPF 30+ sunscreen, sunglasses, and protective clothing.`,
        bestWindow: 'Before 10 AM or after 4 PM for outdoor activities'
      });
    }
    
    const optimalWindows = [];
    if (weather.aqi <= 100 && weather.uvIndex < 6 && weather.temperature >= 15 && weather.temperature <= 25) {
      optimalWindows.push({
        type: 'fitness',
        title: 'Ideal Workout Window',
        message: `Perfect conditions: Low AQI (${weather.aqi}), moderate UV (${weather.uvIndex}), comfortable temp (${weather.temperature}°C).`,
        timeWindow: 'Current conditions optimal for 2-3 hours'
      });
    }

    // Call Lovable AI for activity recommendations
    const aiPrompt = `Based on the following weather and health conditions in ${location}:

Weather:
- Temperature: ${weather.temperature}°C
- Condition: ${weather.condition}
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} km/h
- Rain Chance: ${weather.rainChance}%

Health Factors:
- Air Quality Index (AQI): ${weather.aqi} (${weather.aqiCategory})
- UV Index: ${weather.uvIndex} (${weather.uvCategory})

Generate 6 creative and health-conscious activity recommendations.
For activities, prioritize:
- Indoor activities if AQI > 150 or UV Index > 8
- Low-intensity activities if AQI > 100
- Shade/indoor alternatives if UV Index > 6

For each activity, provide:
1. A catchy, specific title
2. A detailed description (2-3 sentences)
3. A category (Indoor, Outdoor, Sports, Cultural, Food & Dining, or Entertainment)

Format your response as a JSON array with objects containing "title", "description", "category" fields.`;

    console.log('Calling Lovable AI...');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful weather-based activity planning assistant. Always respond with valid JSON arrays containing activity objects.' 
          },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    let activities = [];
    try {
      const content = aiData.choices[0].message.content;
      console.log('AI content:', content);
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        activities = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in AI response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      activities = [
        {
          title: "Perfect Weather Outing",
          description: `Enjoy the ${weather.condition.toLowerCase()} weather with an outdoor adventure. The ${weather.temperature}°C temperature makes it ideal for exploring.`,
          category: "Outdoor"
        },
        {
          title: "Cozy Indoor Activity",
          description: "Visit a local museum or art gallery. Perfect regardless of outdoor conditions.",
          category: "Cultural"
        },
        {
          title: "Local Dining Experience",
          description: "Try a new restaurant or café in your area. Good food is enjoyable in any weather!",
          category: "Food & Dining"
        }
      ];
    }

    // Generate "Best Time to Go Out" based on AQI from hourly data
    const bestTimeSlots: { time: string; aqi: number; aqiCategory: string; recommendation: string }[] = [];

    // Use hourly forecasts to estimate AQI windows
    // OpenWeatherMap free tier doesn't give hourly AQI, so we estimate based on current AQI + time-of-day patterns
    const currentAqi = weather.aqi;
    const timeWindows = [
      { time: 'Early Morning (6–8 AM)', factor: 0.7 },
      { time: 'Morning (8–10 AM)', factor: 0.8 },
      { time: 'Midday (10 AM–1 PM)', factor: 1.1 },
      { time: 'Afternoon (1–4 PM)', factor: 1.2 },
      { time: 'Evening (4–7 PM)', factor: 0.9 },
      { time: 'Night (7–9 PM)', factor: 0.75 },
    ];

    for (const window of timeWindows) {
      const estimatedAqi = Math.round(currentAqi * window.factor);
      const cat = estimatedAqi <= 50 ? 'Good' : estimatedAqi <= 100 ? 'Moderate' : estimatedAqi <= 150 ? 'Unhealthy for Sensitive Groups' : 'Unhealthy';
      let recommendation = '';
      if (estimatedAqi <= 50) recommendation = 'Excellent air quality – great for all outdoor activities.';
      else if (estimatedAqi <= 100) recommendation = 'Acceptable air quality – suitable for most people.';
      else if (estimatedAqi <= 150) recommendation = 'Sensitive groups should limit prolonged outdoor exertion.';
      else recommendation = 'Unhealthy – avoid outdoor activities if possible.';

      bestTimeSlots.push({ time: window.time, aqi: estimatedAqi, aqiCategory: cat, recommendation });
    }

    // Sort by best (lowest) AQI first
    bestTimeSlots.sort((a, b) => a.aqi - b.aqi);

    console.log('Returning recommendations:', activities.length);

    return new Response(
      JSON.stringify({ 
        weather, 
        activities, 
        forecasts,
        hourlyForecasts: hourlyForecasts || [],
        alerts,
        healthNotifications,
        optimalWindows,
        bestTimeSlots
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.toString() : String(error)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

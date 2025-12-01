import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Generate mock weather data with AQI and UV index
    const mockTemp = Math.floor(Math.random() * 15) + 15; // 15-30°C
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const rainChance = condition === 'Light Rain' ? Math.floor(Math.random() * 50) + 30 : Math.floor(Math.random() * 30);
    
    // Generate AQI (Air Quality Index) - 0-500 scale
    const aqi = Math.floor(Math.random() * 200) + 10; // 10-210
    const aqiCategory = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : aqi <= 150 ? 'Unhealthy for Sensitive Groups' : aqi <= 200 ? 'Unhealthy' : 'Very Unhealthy';
    
    // Generate UV Index - 0-11+ scale
    const uvIndex = Math.floor(Math.random() * 12); // 0-11
    const uvCategory = uvIndex <= 2 ? 'Low' : uvIndex <= 5 ? 'Moderate' : uvIndex <= 7 ? 'High' : uvIndex <= 10 ? 'Very High' : 'Extreme';
    
    // Generate pollen count
    const pollenLevel = Math.floor(Math.random() * 4); // 0-3
    const pollenCategory = ['Low', 'Moderate', 'High', 'Very High'][pollenLevel];
    
    console.log('Generated mock weather for:', location);

    const weather = {
      temperature: mockTemp,
      condition: condition,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      visibility: Math.floor(Math.random() * 5) + 5,
      pressure: Math.floor(Math.random() * 30) + 1000,
      rainChance: rainChance,
      aqi: aqi,
      aqiCategory: aqiCategory,
      uvIndex: uvIndex,
      uvCategory: uvCategory,
      pollenLevel: pollenLevel,
      pollenCategory: pollenCategory,
    };

    // Generate 5-day forecast
    const forecasts = Array.from({ length: 5 }, (_, i) => {
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
    
    // AQI-based notifications
    if (aqi > 100) {
      healthNotifications.push({
        type: 'aqi',
        severity: aqi > 150 ? 'alert' : 'warning',
        title: 'Poor Air Quality Alert',
        message: `AQI is ${aqi} (${aqiCategory}). ${aqi > 150 ? 'Avoid outdoor activities. Stay indoors with air filtration.' : 'Limit prolonged outdoor activities, especially for sensitive groups with asthma or respiratory conditions.'}`,
        bestWindow: aqi < 150 ? 'Early morning (6-8 AM) typically has better air quality' : null
      });
    }
    
    // UV-based notifications
    if (uvIndex >= 6) {
      healthNotifications.push({
        type: 'uv',
        severity: uvIndex >= 8 ? 'alert' : 'warning',
        title: `${uvCategory} UV Index`,
        message: `UV Index is ${uvIndex}. Wear SPF 30+ sunscreen, sunglasses, and protective clothing. Seek shade during peak hours (10 AM - 4 PM).`,
        bestWindow: 'Before 10 AM or after 4 PM for outdoor activities'
      });
    }
    
    // Pollen-based notifications
    if (pollenLevel >= 2) {
      healthNotifications.push({
        type: 'pollen',
        severity: pollenLevel >= 3 ? 'alert' : 'warning',
        title: `${pollenCategory} Pollen Count`,
        message: `Pollen levels are ${pollenCategory.toLowerCase()}. ${pollenLevel >= 3 ? 'Take allergy medication before going outside.' : 'Consider taking allergy medication if you have allergies.'}`,
        bestWindow: 'Evening hours typically have lower pollen counts'
      });
    }
    
    // Optimal activity windows
    const optimalWindows = [];
    if (aqi <= 100 && uvIndex < 6 && weather.temperature >= 15 && weather.temperature <= 25) {
      optimalWindows.push({
        type: 'fitness',
        title: 'Ideal Workout Window',
        message: `Perfect conditions now: Low AQI (${aqi}), moderate UV (${uvIndex}), comfortable temp (${weather.temperature}°C). Great time for outdoor exercise!`,
        timeWindow: 'Current conditions optimal for 2-3 hours'
      });
    }

    // Call Lovable AI for activity recommendations with health context
    const aiPrompt = `Based on the following comprehensive weather and health conditions in ${location}:

Weather:
- Temperature: ${weather.temperature}°C
- Condition: ${weather.condition}
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} mph
- Rain Chance: ${weather.rainChance}%

Health Factors:
- Air Quality Index (AQI): ${weather.aqi} (${weather.aqiCategory})
- UV Index: ${weather.uvIndex} (${weather.uvCategory})
- Pollen Level: ${weather.pollenCategory}

Generate 6 creative and health-conscious activity recommendations that consider both weather and health factors.
For activities, prioritize:
- Indoor activities if AQI > 150 or UV Index > 8
- Low-intensity activities if AQI > 100
- Shade/indoor alternatives if UV Index > 6
- Low-pollen exposure activities if pollen is High or Very High

For each activity, provide:
1. A catchy, specific title
2. A detailed description (2-3 sentences) explaining why it's perfect for these conditions AND safe for health
3. A category (Indoor, Outdoor, Sports, Cultural, Food & Dining, or Entertainment)
4. Health considerations if relevant

Format your response as a JSON array with objects containing "title", "description", "category", and optional "healthNote" fields.`;

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
      
      // Extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        activities = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in AI response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback activities if AI parsing fails
      activities = [
        {
          title: "Perfect Weather Outing",
          description: `Enjoy the ${weather.condition.toLowerCase()} weather with an outdoor adventure. The ${weather.temperature}°C temperature makes it ideal for exploring local parks or nature trails.`,
          category: "Outdoor"
        },
        {
          title: "Cozy Indoor Activity",
          description: "Visit a local museum or art gallery. The controlled environment is perfect regardless of outdoor conditions.",
          category: "Cultural"
        },
        {
          title: "Local Dining Experience",
          description: "Try a new restaurant or café in your area. Good food is enjoyable in any weather!",
          category: "Food & Dining"
        }
      ];
    }

    console.log('Returning recommendations:', activities.length);

    return new Response(
      JSON.stringify({ 
        weather, 
        activities, 
        forecasts, 
        alerts,
        healthNotifications,
        optimalWindows
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

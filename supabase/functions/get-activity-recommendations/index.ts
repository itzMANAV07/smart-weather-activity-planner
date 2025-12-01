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

    // Generate mock weather data
    const mockTemp = Math.floor(Math.random() * 15) + 15; // 15-30°C
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const rainChance = condition === 'Light Rain' ? Math.floor(Math.random() * 50) + 30 : Math.floor(Math.random() * 30);
    
    console.log('Generated mock weather for:', location);

    const weather = {
      temperature: mockTemp,
      condition: condition,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      visibility: Math.floor(Math.random() * 5) + 5,
      pressure: Math.floor(Math.random() * 30) + 1000,
      rainChance: rainChance,
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

    // Call Lovable AI for activity recommendations
    const aiPrompt = `Based on the following weather conditions in ${location}:
- Temperature: ${weather.temperature}°C
- Condition: ${weather.condition}
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} mph

Generate 6 creative and specific activity recommendations that are perfect for these weather conditions.
For each activity, provide:
1. A catchy, specific title
2. A detailed description (2-3 sentences) explaining why it's perfect for this weather
3. A category (Indoor, Outdoor, Sports, Cultural, Food & Dining, or Entertainment)

Format your response as a JSON array with objects containing "title", "description", and "category" fields.`;

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
      JSON.stringify({ weather, activities, forecasts, alerts }),
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

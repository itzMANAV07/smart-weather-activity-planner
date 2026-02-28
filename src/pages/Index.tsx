import { useState } from "react";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WeatherCard } from "@/components/WeatherCard";
import { ActivitySuggestions } from "@/components/ActivitySuggestions";
import { ForecastTabs } from "@/components/ForecastTabs";
import { WeatherAlerts } from "@/components/WeatherAlerts";
import { WeatherMetricsGrid } from "@/components/WeatherMetricsGrid";
import { OutfitSuggestions } from "@/components/OutfitSuggestions";
import { BestTimeToGoOut } from "@/components/BestTimeToGoOut";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchWeatherData,
  type WeatherData,
  type DailyForecast,
  type HourlyForecast,
  type WeatherAlert,
  type BestTimeSlot,
} from "@/services/weatherService";

interface Activity {
  title: string;
  description: string;
  category: string;
}

const Index = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [forecasts, setForecasts] = useState<DailyForecast[]>([]);
  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyForecast[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [bestTimeSlots, setBestTimeSlots] = useState<BestTimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location to get recommendations",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setWeather(null);
    setActivities([]);
    setForecasts([]);
    setHourlyForecasts([]);
    setAlerts([]);
    setBestTimeSlots([]);

    try {
      // Step 1: Fetch weather data directly from OpenWeatherMap (fast, no edge function needed)
      const weatherResult = await fetchWeatherData(location.trim());

      // Set weather data immediately so the user sees it fast
      setWeather(weatherResult.weather);
      setForecasts(weatherResult.forecasts);
      setHourlyForecasts(weatherResult.hourlyForecasts);
      setAlerts(weatherResult.alerts);
      setBestTimeSlots(weatherResult.bestTimeSlots);

      toast({
        title: "Weather data loaded!",
        description: `Loading activity suggestions for ${location}...`,
      });

      // Step 2: Call edge function ONLY for AI activity recommendations (in background)
      try {
        const { data, error } = await supabase.functions.invoke('get-activity-recommendations', {
          body: { location: location.trim(), weather: weatherResult.weather },
        });

        if (!error && data?.activities) {
          setActivities(data.activities);
        } else {
          // Use fallback activities
          setActivities(getFallbackActivities(weatherResult.weather));
        }
      } catch (_aiError) {
        console.warn("AI recommendations unavailable, using fallback");
        setActivities(getFallbackActivities(weatherResult.weather));
      }

      toast({
        title: "Recommendations ready!",
        description: `Found activities for ${location}`,
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLocationDetected={setLocation} onSearch={handleSearch} />
      <div className="pt-16">
        <Hero location={location} onLocationChange={setLocation} onSearch={handleSearch} />
      </div>
      <div className="container mx-auto px-4 py-12 space-y-12">
        {alerts.length > 0 && <WeatherAlerts alerts={alerts} />}
        {weather && (
          <>
            {weather.uvIndex !== undefined && (
              <WeatherMetricsGrid
                uvIndex={weather.uvIndex}
                uvCategory={weather.uvCategory}
                feelsLike={weather.feelsLike}
                humidity={weather.humidity}
                windSpeed={weather.windSpeed}
                pressure={weather.pressure}
                visibility={weather.visibility}
                sunrise={weather.sunrise}
                sunset={weather.sunset}
              />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherCard weather={weather} location={location} />
              <OutfitSuggestions
                temperature={weather.temperature}
                condition={weather.condition}
                rainChance={weather.rainChance}
                uvIndex={weather.uvIndex}
              />
            </div>
            {bestTimeSlots.length > 0 && (
              <BestTimeToGoOut
                currentAqi={weather.aqi}
                currentAqiCategory={weather.aqiCategory}
                bestTimeSlots={bestTimeSlots}
              />
            )}
            <ActivitySuggestions activities={activities} loading={loading} />
          </>
        )}
        {weather && (forecasts.length > 0 || hourlyForecasts.length > 0) && (
          <ForecastTabs
            hourlyForecasts={hourlyForecasts}
            dailyForecasts={forecasts}
            currentWeather={{
              temperature: weather.temperature,
              condition: weather.condition,
              rainChance: weather.rainChance,
            }}
          />
        )}
      </div>
    </div>
  );
};

function getFallbackActivities(weather: WeatherData) {
  return [
    { title: "Explore Outdoors", description: `Enjoy the ${weather.condition.toLowerCase()} weather at ${weather.temperature}°C.`, category: "Outdoor" },
    { title: "Visit a Museum", description: "Perfect for any weather. Discover local art and history.", category: "Cultural" },
    { title: "Local Dining", description: "Try a new restaurant or café nearby.", category: "Food & Dining" },
  ];
}

export default Index;

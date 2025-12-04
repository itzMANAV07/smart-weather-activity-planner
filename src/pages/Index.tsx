// Import React's useState to manage changing data (like location input, weather data)
import { useState } from "react";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WeatherCard } from "@/components/WeatherCard";
import { ActivitySuggestions } from "@/components/ActivitySuggestions";
import { ForecastTabs } from "@/components/ForecastTabs";
import { WeatherAlerts } from "@/components/WeatherAlerts";
import { WeatherMetricsGrid } from "@/components/WeatherMetricsGrid";
import { OutfitSuggestions } from "@/components/OutfitSuggestions";

// Import toast for showing pop-up messages to the user
import { useToast } from "@/hooks/use-toast";

// Import supabase to connect to our backend (where weather data comes from)
import { supabase } from "@/integrations/supabase/client";

// Define what weather data looks like (the structure of the information)
interface WeatherData {
  temperature: number;        // Temperature in degrees
  feelsLike: number;          // Feels like temperature
  condition: string;          // Weather description like "Sunny" or "Rainy"
  humidity: number;           // Moisture in the air (percentage)
  windSpeed: number;          // How fast the wind is blowing
  visibility: number;         // How far you can see
  pressure: number;           // Atmospheric pressure
  rainChance: number;         // Percentage chance of rain
  aqi: number;                // Air Quality Index
  aqiCategory: string;        // AQI category (Good, Moderate, etc.)
  uvIndex: number;            // UV Index
  uvCategory: string;         // UV category (Low, Moderate, etc.)
}

// Define what an activity recommendation looks like
interface Activity {
  title: string;              // Name of the activity
  description: string;        // Details about why it's good for this weather
  category: string;           // Type of activity (Indoor, Outdoor, etc.)
}

// Define what a daily forecast looks like
interface DailyForecast {
  date: string;               // The date (like "Jan 5")
  day: string;                // Day of the week (like "Mon")
  tempHigh: number;           // Highest temperature of the day
  tempLow: number;            // Lowest temperature of the day
  condition: string;          // Weather description
  rainChance: number;         // Percentage chance of rain
  needsUmbrella: boolean;     // Should you bring an umbrella?
}

// Define what an hourly forecast looks like
interface HourlyForecast {
  time: string;               // Time like "3 PM"
  temp: number;               // Temperature
  condition: string;          // Weather description
  rainChance: number;         // Percentage chance of rain
}

// Define what weather alerts look like
interface WeatherAlert {
  type: string;               // Type of alert (rain, wind, temperature)
  severity: "warning" | "severe" | "extreme";  // How serious it is
  title: string;              // Short description
  description: string;        // Full details
}

// This is the main page component
const Index = () => {
  // Create variables to store our data (these can change)
  const [location, setLocation] = useState("");                       // User's typed location
  const [weather, setWeather] = useState<WeatherData | null>(null);   // Current weather data
  const [activities, setActivities] = useState<Activity[]>([]);       // List of activity suggestions
  const [forecasts, setForecasts] = useState<DailyForecast[]>([]);   // Daily forecast
  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyForecast[]>([]); // Hourly forecast
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);           // Weather warnings
  const [loading, setLoading] = useState(false);                      // Is data being loaded?
  const { toast } = useToast();                                       // For showing messages

  // This function runs when the user clicks the search button
  const handleSearch = async () => {
    // Check if user entered a location (trim removes extra spaces)
    if (!location.trim()) {
      // Show error message if location is empty
      toast({
        title: "Location required",
        description: "Please enter a location to get recommendations",
        variant: "destructive",
      });
      return;  // Stop here, don't search
    }

    // Show loading animation and clear old data
    setLoading(true);
    setWeather(null);
    setActivities([]);
    setForecasts([]);
    setHourlyForecasts([]);
    setAlerts([]);

    try {
      // Call our backend to get weather data and activity suggestions
      // This is like making a phone call to ask for information
      const { data, error } = await supabase.functions.invoke('get-activity-recommendations', {
        body: { location: location.trim() }  // Send the location to the backend
      });

      // If something went wrong, throw an error
      if (error) throw error;

      // Save all the data we got back
      setWeather(data.weather);              // Current weather info
      setActivities(data.activities);        // Activity suggestions
      setForecasts(data.forecasts || []);    // Daily forecast
      setHourlyForecasts(data.hourlyForecasts || []); // Hourly forecast
      setAlerts(data.alerts || []);

      // Show success message
      toast({
        title: "Recommendations ready!",
        description: `Found ${data.activities.length} activities for ${location}`,
      });
    } catch (error: any) {
      // If something went wrong, log it and show error message
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      // No matter what happens, stop showing the loading animation
      setLoading(false);
    }
  };

  // This is what gets displayed on the screen
  return (
    <div className="min-h-screen bg-background">
      {/* Header with dark mode toggle */}
      <Header 
        onLocationDetected={setLocation}
        onSearch={handleSearch}
      />
      
      {/* Top section with search bar and title */}
      <div className="pt-16">
        <Hero 
          location={location}
          onLocationChange={setLocation}
          onSearch={handleSearch}
        />
      </div>
      
      {/* Main content area */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Show weather alerts if there are any */}
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
              />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherCard weather={weather} location={location} />
              <OutfitSuggestions 
                temperature={weather.temperature}
                condition={weather.condition}
                rainChance={weather.rainChance}
              />
            </div>
            
            <ActivitySuggestions activities={activities} loading={loading} />
          </>
        )}
        
        {/* Show forecast tabs if we have forecast data */}
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

// Export this component so it can be used in other files
export default Index;

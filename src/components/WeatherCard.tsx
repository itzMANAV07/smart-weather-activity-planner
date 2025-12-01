// Import weather icons and card component
import { Cloud, Droplets, Wind, Eye, Gauge, CloudRain, Umbrella } from "lucide-react";
import { Card } from "@/components/ui/card";

// Define what weather data looks like
interface WeatherData {
  temperature: number;   // Temp in degrees
  condition: string;     // Description like "Sunny"
  humidity: number;      // Moisture level
  windSpeed: number;     // Wind speed
  visibility: number;    // How far you can see
  pressure: number;      // Air pressure
  rainChance: number;    // Chance of rain (percentage)
}

// Define what information this component needs
interface WeatherCardProps {
  weather: WeatherData;  // The weather information
  location: string;      // Location name
}

// This component shows current weather details
export const WeatherCard = ({ weather, location }: WeatherCardProps) => {
  // Calculate if umbrella is needed (rain chance over 30%)
  const needsUmbrella = weather.rainChance > 30;
  
  // Display the weather card
  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-2 shadow-medium animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="space-y-6">
        {/* Top section: location, temperature, and condition */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">{location}</h2>
          <div className="flex items-center justify-center gap-4">
            {/* Cloud icon */}
            <Cloud className="h-16 w-16 text-primary" />
            <div>
              {/* Big temperature number */}
              <p className="text-6xl font-bold text-foreground">{weather.temperature}°C</p>
              {/* Weather condition text */}
              <p className="text-xl text-muted-foreground">{weather.condition}</p>
            </div>
          </div>
          
          {/* Show umbrella warning if rain chance is high */}
          {needsUmbrella && (
            <div className="flex items-center justify-center gap-2 mt-4 text-accent-foreground bg-accent/20 rounded-lg px-4 py-2 animate-in fade-in slide-in-from-top-2 duration-700">
              <Umbrella className="h-5 w-5" />
              <p className="font-semibold">Umbrella recommended!</p>
            </div>
          )}
        </div>

        {/* Bottom section: detailed weather stats in a grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-border">
          {/* Humidity stat */}
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="text-lg font-semibold text-foreground">{weather.humidity}%</p>
            </div>
          </div>

          {/* Wind speed stat */}
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Wind</p>
              <p className="text-lg font-semibold text-foreground">{weather.windSpeed} mph</p>
            </div>
          </div>

          {/* Visibility stat */}
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Visibility</p>
              <p className="text-lg font-semibold text-foreground">{weather.visibility} mi</p>
            </div>
          </div>

          {/* Pressure stat */}
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Pressure</p>
              <p className="text-lg font-semibold text-foreground">{weather.pressure} mb</p>
            </div>
          </div>

          {/* Rain chance stat */}
          <div className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Rain Chance</p>
              <p className="text-lg font-semibold text-foreground">{weather.rainChance}%</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

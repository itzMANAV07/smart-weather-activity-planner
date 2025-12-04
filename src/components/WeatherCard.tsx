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

        {/* Weather details list */}
        <div className="divide-y divide-border pt-4 border-t border-border">
          {/* Wind */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Wind className="h-5 w-5 text-primary" />
              <span className="text-foreground font-medium">Wind</span>
            </div>
            <span className="text-foreground font-semibold">{weather.windSpeed} km/h</span>
          </div>

          {/* Humidity */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-primary" />
              <span className="text-foreground font-medium">Humidity</span>
            </div>
            <span className="text-foreground font-semibold">{weather.humidity}%</span>
          </div>

          {/* Pressure */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Gauge className="h-5 w-5 text-primary" />
              <span className="text-foreground font-medium">Pressure</span>
            </div>
            <span className="text-foreground font-semibold">{weather.pressure} mb</span>
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-primary" />
              <span className="text-foreground font-medium">Visibility</span>
            </div>
            <span className="text-foreground font-semibold">{weather.visibility} km</span>
          </div>

          {/* Rain Chance */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <CloudRain className="h-5 w-5 text-primary" />
              <span className="text-foreground font-medium">Rain Chance</span>
            </div>
            <span className="text-foreground font-semibold">{weather.rainChance}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

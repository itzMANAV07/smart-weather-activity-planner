// Import card component and weather icons
import { Card } from "@/components/ui/card";
import { CloudRain, Umbrella, Sun, Cloud, CloudSnow } from "lucide-react";

// Define what a daily forecast looks like
interface DailyForecast {
  date: string;           // Date like "Jan 5"
  day: string;            // Day like "Mon"
  tempHigh: number;       // High temperature
  tempLow: number;        // Low temperature
  condition: string;      // Weather description
  rainChance: number;     // Chance of rain (%)
  needsUmbrella: boolean; // Do you need an umbrella?
}

// Define what information this component needs
interface ForecastCardProps {
  forecasts: DailyForecast[];  // Array of 5 daily forecasts
}

// This component shows a 5-day weather forecast
export const ForecastCard = ({ forecasts }: ForecastCardProps) => {
  // Function to pick the right icon based on weather condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();  // Convert to lowercase for easier checking
    if (conditionLower.includes('rain')) return <CloudRain className="h-8 w-8 text-primary" />;
    if (conditionLower.includes('snow')) return <CloudSnow className="h-8 w-8 text-primary" />;
    if (conditionLower.includes('cloud')) return <Cloud className="h-8 w-8 text-primary" />;
    return <Sun className="h-8 w-8 text-primary" />;  // Default to sun icon
  };

  // Don't show anything if there are no forecasts
  if (forecasts.length === 0) return null;

  // Display the forecast card
  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-2 shadow-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title */}
      <h3 className="text-2xl font-bold text-foreground mb-6">5-Day Forecast</h3>
      {/* Grid of 5 daily forecasts */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Loop through each day */}
        {forecasts.map((forecast, index) => (
          <div
            key={index}  // Unique identifier for React
            className="flex flex-col items-center p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
          >
            {/* Day name (Mon, Tue, etc.) */}
            <p className="font-semibold text-foreground mb-2">{forecast.day}</p>
            {/* Date (Jan 5, etc.) */}
            <p className="text-sm text-muted-foreground mb-3">{forecast.date}</p>
            
            {/* Weather icon based on condition */}
            {getWeatherIcon(forecast.condition)}
            
            {/* Weather condition text */}
            <p className="text-sm text-muted-foreground mt-2">{forecast.condition}</p>
            
            {/* High and low temperature */}
            <div className="flex gap-2 mt-3">
              <span className="text-lg font-bold text-foreground">{forecast.tempHigh}°</span>
              <span className="text-lg text-muted-foreground">{forecast.tempLow}°</span>
            </div>
            
            {/* Rain chance percentage */}
            <div className="flex items-center gap-1 mt-2 text-sm">
              <CloudRain className="h-4 w-4 text-primary" />
              <span className="text-foreground">{forecast.rainChance}%</span>
            </div>
            
            {/* Show umbrella badge if needed */}
            {forecast.needsUmbrella && (
              <div className="flex items-center gap-1 mt-2 text-xs text-accent-foreground bg-accent/20 rounded px-2 py-1">
                <Umbrella className="h-3 w-3" />
                <span>Umbrella</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

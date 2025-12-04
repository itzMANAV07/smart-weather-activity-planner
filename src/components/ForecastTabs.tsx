import { Card } from "@/components/ui/card";
import { CloudRain, Sun, Cloud, CloudSnow } from "lucide-react";

interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  rainChance: number;
}

interface DailyForecast {
  date: string;
  day: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  rainChance: number;
  needsUmbrella: boolean;
}

interface ForecastTabsProps {
  hourlyForecasts: HourlyForecast[];
  dailyForecasts: DailyForecast[];
  currentWeather: {
    temperature: number;
    condition: string;
    rainChance: number;
  };
}

export const ForecastTabs = ({ hourlyForecasts, dailyForecasts, currentWeather }: ForecastTabsProps) => {
  const getWeatherIcon = (condition: string, size: string = "h-6 w-6") => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain')) return <CloudRain className={`${size} text-muted-foreground`} />;
    if (conditionLower.includes('snow')) return <CloudSnow className={`${size} text-muted-foreground`} />;
    if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) return <Cloud className={`${size} text-muted-foreground`} />;
    return <Sun className={`${size} text-amber-400`} />;
  };

  return (
    <div className="space-y-4">
      {/* Hourly Forecast - Horizontal Scroll */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border shadow-soft">
        <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
          {/* Current "Now" */}
          <div className="flex flex-col items-center min-w-[50px]">
            <p className="text-sm text-muted-foreground mb-2">Now</p>
            {getWeatherIcon(currentWeather.condition)}
            <p className="text-lg font-semibold text-foreground mt-2">{currentWeather.temperature}°</p>
          </div>
          
          {/* Hourly forecasts */}
          {hourlyForecasts.map((hour, index) => (
            <div key={index} className="flex flex-col items-center min-w-[50px]">
              <p className="text-sm text-muted-foreground mb-2">{hour.time}</p>
              {getWeatherIcon(hour.condition)}
              <p className="text-lg font-semibold text-foreground mt-2">{hour.temp}°</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Daily Forecast - List View */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border shadow-soft">
        <div className="space-y-3">
          {dailyForecasts.map((forecast, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3 min-w-[100px]">
                <span className="text-sm text-muted-foreground w-12">{forecast.date}</span>
                <span className="text-sm font-medium text-foreground">{forecast.day}</span>
              </div>
              
              <div className="flex items-center justify-center">
                {getWeatherIcon(forecast.condition)}
              </div>
              
              <div className="flex items-center gap-2 min-w-[80px] justify-end">
                <span className="text-foreground font-semibold">{forecast.tempLow}°</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground font-semibold">{forecast.tempHigh}°</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
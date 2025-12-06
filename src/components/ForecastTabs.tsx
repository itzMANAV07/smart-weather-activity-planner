import { Card } from "@/components/ui/card";
import { AnimatedWeatherIcon } from "./AnimatedWeatherIcon";

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

  return (
    <div className="space-y-4">
      {/* Hourly Forecast - Horizontal Scroll */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border shadow-soft">
        <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
          {/* Current "Now" */}
          <div className="flex flex-col items-center min-w-[50px]">
            <p className="text-sm text-muted-foreground mb-2">Now</p>
            <AnimatedWeatherIcon condition={currentWeather.condition} size="h-6 w-6" />
            <p className="text-lg font-semibold text-foreground mt-2">{currentWeather.temperature}°</p>
          </div>
          
          {/* Hourly forecasts */}
          {hourlyForecasts.map((hour, index) => (
            <div key={index} className="flex flex-col items-center min-w-[50px]">
              <p className="text-sm text-muted-foreground mb-2">{hour.time}</p>
              <AnimatedWeatherIcon condition={hour.condition} size="h-6 w-6" />
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
                <AnimatedWeatherIcon condition={forecast.condition} size="h-6 w-6" />
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
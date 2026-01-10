import { Card } from "@/components/ui/card";
import { AnimatedWeatherIcon } from "./AnimatedWeatherIcon";
import { Droplets, Wind } from "lucide-react";
import { motion } from "framer-motion";

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
  // Calculate temperature range for the bar visualization
  const allTemps = dailyForecasts.flatMap(f => [f.tempHigh, f.tempLow]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const tempRange = maxTemp - minTemp || 1;

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-foreground">Weather Forecast</h2>
        <div className="h-px flex-1 bg-border/50" />
      </div>

      {/* Hourly Forecast - Professional Horizontal Scroll */}
      <Card className="p-6 bg-card/90 backdrop-blur-md border border-border/50 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-foreground">Hourly Forecast</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Next 24 hours</span>
        </div>
        
        <div className="flex overflow-x-auto gap-1 pb-2 scrollbar-hide">
          {/* Current "Now" */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center min-w-[72px] p-3 rounded-xl bg-primary/10 border border-primary/20"
          >
            <p className="text-xs font-semibold text-primary mb-2">Now</p>
            <AnimatedWeatherIcon condition={currentWeather.condition} size="h-8 w-8" />
            <p className="text-xl font-bold text-foreground mt-2">{currentWeather.temperature}°</p>
            <div className="flex items-center gap-1 mt-1">
              <Droplets className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-muted-foreground">{currentWeather.rainChance}%</span>
            </div>
          </motion.div>
          
          {/* Hourly forecasts */}
          {hourlyForecasts.map((hour, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col items-center min-w-[72px] p-3 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <p className="text-xs text-muted-foreground mb-2">{hour.time}</p>
              <AnimatedWeatherIcon condition={hour.condition} size="h-8 w-8" />
              <p className="text-xl font-bold text-foreground mt-2">{hour.temp}°</p>
              <div className="flex items-center gap-1 mt-1">
                <Droplets className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-muted-foreground">{hour.rainChance}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* 5-Day Forecast - Professional List View */}
      <Card className="p-6 bg-card/90 backdrop-blur-md border border-border/50 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-foreground">5-Day Forecast</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Extended outlook</span>
        </div>
        
        <div className="space-y-2">
          {dailyForecasts.map((forecast, index) => {
            // Calculate position for temperature bar
            const lowPos = ((forecast.tempLow - minTemp) / tempRange) * 100;
            const highPos = ((forecast.tempHigh - minTemp) / tempRange) * 100;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-muted/30 transition-colors group"
              >
                {/* Day and Date */}
                <div className="w-24 flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground">{forecast.day}</p>
                  <p className="text-xs text-muted-foreground">{forecast.date}</p>
                </div>
                
                {/* Weather Icon */}
                <div className="w-12 flex-shrink-0 flex justify-center">
                  <AnimatedWeatherIcon condition={forecast.condition} size="h-8 w-8" />
                </div>
                
                {/* Rain Chance */}
                <div className="w-16 flex-shrink-0 flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-muted-foreground">{forecast.rainChance}%</span>
                </div>
                
                {/* Temperature Bar */}
                <div className="flex-1 flex items-center gap-3 min-w-[180px]">
                  <span className="text-sm font-medium text-muted-foreground w-8 text-right">{forecast.tempLow}°</span>
                  
                  <div className="flex-1 relative h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${highPos - lowPos}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-400"
                      style={{ left: `${lowPos}%` }}
                    />
                  </div>
                  
                  <span className="text-sm font-semibold text-foreground w-8">{forecast.tempHigh}°</span>
                </div>
                
                {/* Condition Text - Hidden on mobile */}
                <div className="hidden lg:block w-28 flex-shrink-0">
                  <p className="text-sm text-muted-foreground capitalize">{forecast.condition}</p>
                </div>
                
                {/* Umbrella indicator */}
                {forecast.needsUmbrella && (
                  <div className="flex-shrink-0">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-medium">
                      ☂️ Bring umbrella
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

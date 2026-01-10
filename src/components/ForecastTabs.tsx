import { Card } from "@/components/ui/card";
import { AnimatedWeatherIcon } from "./AnimatedWeatherIcon";
import { Droplets, Umbrella, Calendar } from "lucide-react";
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
  return (
    <div className="space-y-8">
      {/* Hourly Forecast - Professional Design */}
      <Card className="p-6 bg-card/90 backdrop-blur-md border border-border/50 shadow-lg overflow-hidden">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Hourly Forecast</h3>
            <p className="text-xs text-muted-foreground">Next 24 hours</p>
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-2 px-2">
          {/* Current "Now" */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center min-w-[80px] p-4 rounded-2xl bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/30"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">Now</p>
            <AnimatedWeatherIcon condition={currentWeather.condition} size="h-10 w-10" />
            <p className="text-2xl font-bold text-foreground mt-2">{currentWeather.temperature}°</p>
            <div className="flex items-center gap-1 mt-2 text-blue-400">
              <Droplets className="h-3 w-3" />
              <span className="text-xs font-medium">{currentWeather.rainChance}%</span>
            </div>
          </motion.div>
          
          {/* Hourly forecasts */}
          {hourlyForecasts.map((hour, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col items-center min-w-[80px] p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 border border-transparent hover:border-border/50"
            >
              <p className="text-xs font-medium text-muted-foreground mb-2">{hour.time}</p>
              <AnimatedWeatherIcon condition={hour.condition} size="h-10 w-10" />
              <p className="text-2xl font-bold text-foreground mt-2">{hour.temp}°</p>
              <div className="flex items-center gap-1 mt-2 text-blue-400">
                <Droplets className="h-3 w-3" />
                <span className="text-xs font-medium">{hour.rainChance}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* 5-Day Forecast - Card Grid */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">5-Day Forecast</h3>
            <p className="text-xs text-muted-foreground">Extended weather outlook</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dailyForecasts.map((forecast, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden p-5 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                index === 0 
                  ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30' 
                  : 'bg-card/90 backdrop-blur-md border-border/50 hover:border-primary/30'
              }`}>
                {/* Today badge */}
                {index === 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  </div>
                )}

                {/* Day & Date */}
                <div className="text-center mb-4">
                  <p className="text-lg font-bold text-foreground">{forecast.day}</p>
                  <p className="text-xs text-muted-foreground">{forecast.date}</p>
                </div>

                {/* Weather Icon */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-muted/50">
                    <AnimatedWeatherIcon condition={forecast.condition} size="h-12 w-12" />
                  </div>
                </div>

                {/* Condition */}
                <p className="text-sm text-center text-muted-foreground mb-4 capitalize line-clamp-1">
                  {forecast.condition}
                </p>

                {/* Temperature */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{forecast.tempHigh}°</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">High</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-medium text-muted-foreground">{forecast.tempLow}°</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Low</p>
                  </div>
                </div>

                {/* Rain Chance Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-blue-400">
                      <Droplets className="h-3 w-3" />
                      <span className="font-medium">Rain</span>
                    </div>
                    <span className="font-bold text-foreground">{forecast.rainChance}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${forecast.rainChance}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                      className={`h-full rounded-full ${
                        forecast.rainChance > 60 
                          ? 'bg-blue-500' 
                          : forecast.rainChance > 30 
                            ? 'bg-blue-400' 
                            : 'bg-blue-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Umbrella Badge */}
                {forecast.needsUmbrella && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                    className="mt-4 flex items-center justify-center gap-1.5 text-xs bg-blue-500/20 text-blue-400 rounded-full py-1.5 px-3"
                  >
                    <Umbrella className="h-3 w-3" />
                    <span className="font-medium">Bring umbrella</span>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

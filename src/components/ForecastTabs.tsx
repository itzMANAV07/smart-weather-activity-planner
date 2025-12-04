import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CloudRain, Sun, Cloud, CloudSnow, Droplets } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<'today' | 'hourly' | 'daily'>('hourly');

  const getWeatherIcon = (condition: string, size: string = "h-8 w-8") => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain')) return <CloudRain className={`${size} text-primary`} />;
    if (conditionLower.includes('snow')) return <CloudSnow className={`${size} text-primary`} />;
    if (conditionLower.includes('cloud')) return <Cloud className={`${size} text-primary`} />;
    return <Sun className={`${size} text-primary`} />;
  };

  const tabs = [
    { id: 'today' as const, label: 'Today' },
    { id: 'hourly' as const, label: 'Hourly' },
    { id: 'daily' as const, label: 'Daily' },
  ];

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-2 shadow-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tab Navigation */}
      <div className="flex justify-center gap-8 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-background border-2 border-border text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 bg-primary/30 mb-6" />

      {/* Today View */}
      {activeTab === 'today' && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-2">Now</p>
            <div className="flex items-center justify-center gap-4">
              {getWeatherIcon(currentWeather.condition, "h-16 w-16")}
              <p className="text-5xl font-bold text-foreground">{currentWeather.temperature}°</p>
            </div>
            <p className="text-xl text-muted-foreground mt-2">{currentWeather.condition}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
              <Droplets className="h-4 w-4" />
              <span>{currentWeather.rainChance}%</span>
            </div>
          </div>
          
          {/* Today's High/Low from first daily forecast */}
          {dailyForecasts.length > 0 && (
            <div className="flex gap-4 mt-4">
              <span className="text-lg font-semibold text-foreground">H: {dailyForecasts[0].tempHigh}°</span>
              <span className="text-lg text-muted-foreground">L: {dailyForecasts[0].tempLow}°</span>
            </div>
          )}
        </div>
      )}

      {/* Hourly View */}
      {activeTab === 'hourly' && (
        <div className="flex overflow-x-auto gap-2 pb-2">
          {/* Current "Now" card */}
          <div className="flex flex-col items-center p-4 min-w-[80px] rounded-lg bg-background/50">
            <p className="text-sm font-medium text-foreground mb-2">Now</p>
            <p className="text-2xl font-bold text-foreground mb-2">{currentWeather.temperature}°</p>
            {getWeatherIcon(currentWeather.condition, "h-8 w-8")}
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <Droplets className="h-3 w-3" />
              <span>{currentWeather.rainChance}%</span>
            </div>
          </div>
          
          {/* Hourly forecasts */}
          {hourlyForecasts.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 min-w-[80px] rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
            >
              <p className="text-sm font-medium text-foreground mb-2">{hour.time}</p>
              <p className="text-2xl font-bold text-foreground mb-2">{hour.temp}°</p>
              {getWeatherIcon(hour.condition, "h-8 w-8")}
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Droplets className="h-3 w-3" />
                <span>{hour.rainChance}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily View */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {dailyForecasts.map((forecast, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
            >
              <p className="font-semibold text-foreground">{forecast.day}</p>
              <p className="text-sm text-muted-foreground mb-2">{forecast.date}</p>
              {getWeatherIcon(forecast.condition)}
              <p className="text-sm text-muted-foreground mt-2">{forecast.condition}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-lg font-bold text-foreground">{forecast.tempHigh}°</span>
                <span className="text-lg text-muted-foreground">{forecast.tempLow}°</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Droplets className="h-3 w-3" />
                <span>{forecast.rainChance}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

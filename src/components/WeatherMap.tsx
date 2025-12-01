import { Cloud, Sun, CloudRain, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherMapProps {
  location: string;
  temperature: number;
  condition: string;
}

export const WeatherMap = ({ location, temperature, condition }: WeatherMapProps) => {
  const getWeatherIcon = () => {
    if (condition.toLowerCase().includes('rain')) return <CloudRain className="w-16 h-16 text-primary" />;
    if (condition.toLowerCase().includes('cloud')) return <Cloud className="w-16 h-16 text-muted-foreground" />;
    if (condition.toLowerCase().includes('wind')) return <Wind className="w-16 h-16 text-accent" />;
    return <Sun className="w-16 h-16 text-amber-500" />;
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-accent/5 border-2 border-border/50 shadow-elegant">
      <div className="text-center space-y-6">
        <h3 className="text-2xl font-semibold text-foreground">Weather Map</h3>
        
        <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-xl bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 dark:from-sky-900 dark:via-sky-800 dark:to-green-900 overflow-hidden shadow-medium">
          {/* Animated clouds */}
          <div className="absolute top-8 left-10 w-32 h-20 bg-white/40 dark:bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-12 right-20 w-40 h-24 bg-white/30 dark:bg-white/10 rounded-full blur-xl animate-pulse delay-500" />
          <div className="absolute top-20 left-1/3 w-36 h-22 bg-white/35 dark:bg-white/10 rounded-full blur-xl animate-pulse delay-1000" />
          
          {/* Location marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-700">
            <div className="relative">
              {getWeatherIcon()}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
            </div>
            <div className="bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full border border-border shadow-soft">
              <p className="font-semibold text-foreground">{location}</p>
              <p className="text-2xl font-bold text-primary">{temperature}°C</p>
              <p className="text-sm text-muted-foreground">{condition}</p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-200/50 to-transparent dark:from-green-900/50" />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Visual representation of current weather conditions
        </p>
      </div>
    </Card>
  );
};

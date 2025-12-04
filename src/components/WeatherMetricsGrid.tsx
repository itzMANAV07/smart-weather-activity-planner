import { Sun, Thermometer, Droplets, Wind, Gauge, Eye } from "lucide-react";

interface WeatherMetricsGridProps {
  uvIndex: number;
  uvCategory: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
}

export const WeatherMetricsGrid = ({
  uvIndex,
  uvCategory,
  feelsLike,
  humidity,
  windSpeed,
  pressure,
  visibility,
}: WeatherMetricsGridProps) => {
  const metrics = [
    {
      icon: Sun,
      label: "UV Index",
      value: uvIndex.toString(),
      subtext: uvCategory,
    },
    {
      icon: Thermometer,
      label: "Feels Like",
      value: `${feelsLike}°`,
      subtext: feelsLike > 30 ? "Hot" : feelsLike < 10 ? "Cold" : "Comfortable",
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${humidity}%`,
      subtext: humidity > 70 ? "High" : humidity < 30 ? "Low" : "Normal",
    },
    {
      icon: Wind,
      label: "Wind",
      value: `${windSpeed}`,
      subtext: "km/h",
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${pressure}`,
      subtext: "mb",
    },
    {
      icon: Eye,
      label: "Visibility",
      value: `${visibility}`,
      subtext: "km",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-card rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-medium"
        >
          <div className="flex items-center gap-2 mb-3">
            <metric.icon className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">{metric.label}</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-bold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

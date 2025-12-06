import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shirt, Umbrella, Glasses, Wind, CloudSnow, ThermometerSun, Sun as SunIcon } from "lucide-react";

interface OutfitSuggestionsProps {
  temperature: number;
  condition: string;
  rainChance: number;
  uvIndex?: number;
}

export const OutfitSuggestions = ({ temperature, condition, rainChance, uvIndex = 0 }: OutfitSuggestionsProps) => {
  const getOutfitSuggestions = () => {
    const suggestions: { item: string; reason: string; icon: React.ReactNode; priority: number }[] = [];
    const conditionLower = condition.toLowerCase();

    // Sunglasses - based on sunny conditions OR high UV
    const isSunny = conditionLower.includes('sunny') || conditionLower.includes('clear');
    if (isSunny || uvIndex >= 3) {
      suggestions.push({ 
        item: "Sunglasses", 
        reason: isSunny ? "Bright sunny conditions" : `UV Index is ${uvIndex} - protect your eyes`, 
        icon: <Glasses className="h-5 w-5" />,
        priority: 1
      });
    }

    // Sunscreen - based on UV index
    if (uvIndex >= 3) {
      suggestions.push({ 
        item: "Sunscreen SPF 30+", 
        reason: `UV Index is ${uvIndex} (${uvIndex <= 5 ? 'Moderate' : uvIndex <= 7 ? 'High' : 'Very High'}) - protect your skin`, 
        icon: <SunIcon className="h-5 w-5" />,
        priority: 2
      });
    }

    // Umbrella - based on rain chance OR rainy conditions
    if (rainChance >= 30 || conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
      suggestions.push({ 
        item: "Umbrella", 
        reason: conditionLower.includes('rain') ? `${condition} expected` : `${rainChance}% chance of rain`, 
        icon: <Umbrella className="h-5 w-5" />,
        priority: 1
      });
    }

    // Temperature-based suggestions
    if (temperature < 10) {
      suggestions.push({ item: "Warm jacket", reason: `Cold at ${temperature}°C`, icon: <CloudSnow className="h-5 w-5" />, priority: 3 });
      suggestions.push({ item: "Layered clothing", reason: "Stay warm with layers", icon: <Shirt className="h-5 w-5" />, priority: 4 });
    } else if (temperature < 20) {
      suggestions.push({ item: "Light jacket", reason: `Mild at ${temperature}°C`, icon: <Shirt className="h-5 w-5" />, priority: 4 });
    } else if (temperature >= 25) {
      suggestions.push({ item: "Light, breathable clothes", reason: `Warm at ${temperature}°C`, icon: <ThermometerSun className="h-5 w-5" />, priority: 3 });
    }

    // Wind-based suggestions
    if (conditionLower.includes('wind') || conditionLower.includes('breez')) {
      suggestions.push({ item: "Windbreaker", reason: "Protect against wind", icon: <Wind className="h-5 w-5" />, priority: 5 });
    }

    // Default suggestion if none
    if (suggestions.length === 0) {
      suggestions.push({ item: "Comfortable casual wear", reason: "Pleasant weather", icon: <Shirt className="h-5 w-5" />, priority: 10 });
    }

    // Sort by priority and return top 4
    return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 4);
  };

  const suggestions = getOutfitSuggestions();

  return (
    <Card className="p-6 bg-card border border-border/50 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shirt className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Outfit Suggestions</h3>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-all duration-200"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {suggestion.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{suggestion.item}</p>
              <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              Recommended
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

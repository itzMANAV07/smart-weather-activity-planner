import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shirt, Umbrella, Glasses, Wind, CloudSnow, ThermometerSun } from "lucide-react";

interface OutfitSuggestionsProps {
  temperature: number;
  condition: string;
  rainChance: number;
}

export const OutfitSuggestions = ({ temperature, condition, rainChance }: OutfitSuggestionsProps) => {
  const getOutfitSuggestions = () => {
    const suggestions: { item: string; reason: string; icon: React.ReactNode }[] = [];
    const conditionLower = condition.toLowerCase();

    // Temperature-based suggestions
    if (temperature < 10) {
      suggestions.push({ item: "Warm jacket", reason: "It's cold outside", icon: <CloudSnow className="h-5 w-5" /> });
      suggestions.push({ item: "Layered clothing", reason: "Stay warm with layers", icon: <Shirt className="h-5 w-5" /> });
    } else if (temperature < 20) {
      suggestions.push({ item: "Light jacket", reason: "Mild temperatures", icon: <Shirt className="h-5 w-5" /> });
    } else if (temperature >= 25) {
      suggestions.push({ item: "Light, breathable clothes", reason: "Stay cool in the heat", icon: <ThermometerSun className="h-5 w-5" /> });
      suggestions.push({ item: "Sunglasses", reason: "Protect your eyes", icon: <Glasses className="h-5 w-5" /> });
    }

    // Rain-based suggestions
    if (rainChance > 40 || conditionLower.includes('rain')) {
      suggestions.push({ item: "Umbrella", reason: `${rainChance}% chance of rain`, icon: <Umbrella className="h-5 w-5" /> });
      suggestions.push({ item: "Waterproof shoes", reason: "Keep your feet dry", icon: <CloudSnow className="h-5 w-5" /> });
    }

    // Wind-based suggestions
    if (conditionLower.includes('wind')) {
      suggestions.push({ item: "Windbreaker", reason: "Protect against wind", icon: <Wind className="h-5 w-5" /> });
    }

    // Sunny weather
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      if (!suggestions.find(s => s.item === "Sunglasses")) {
        suggestions.push({ item: "Sunglasses", reason: "Bright conditions", icon: <Glasses className="h-5 w-5" /> });
      }
    }

    // Default suggestion if none
    if (suggestions.length === 0) {
      suggestions.push({ item: "Comfortable casual wear", reason: "Pleasant weather", icon: <Shirt className="h-5 w-5" /> });
    }

    return suggestions;
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

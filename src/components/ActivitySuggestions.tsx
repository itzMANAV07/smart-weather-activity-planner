import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Bike, Dumbbell, Coffee, Book, Gamepad2, 
  Trees, Camera, Music, Palette, UtensilsCrossed, ShoppingBag,
  Footprints, Waves, Mountain, Home
} from "lucide-react";

interface Activity {
  title: string;
  description: string;
  category: string;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('outdoor')) return <Trees className="h-5 w-5" />;
  if (cat.includes('indoor')) return <Home className="h-5 w-5" />;
  if (cat.includes('fitness') || cat.includes('exercise')) return <Dumbbell className="h-5 w-5" />;
  if (cat.includes('food') || cat.includes('dining')) return <UtensilsCrossed className="h-5 w-5" />;
  if (cat.includes('shopping')) return <ShoppingBag className="h-5 w-5" />;
  if (cat.includes('relax')) return <Coffee className="h-5 w-5" />;
  return <Sparkles className="h-5 w-5" />;
};

const getActivityIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('bike') || t.includes('cycling')) return <Bike className="h-5 w-5" />;
  if (t.includes('gym') || t.includes('workout') || t.includes('exercise')) return <Dumbbell className="h-5 w-5" />;
  if (t.includes('coffee') || t.includes('cafe')) return <Coffee className="h-5 w-5" />;
  if (t.includes('read') || t.includes('book')) return <Book className="h-5 w-5" />;
  if (t.includes('game') || t.includes('gaming')) return <Gamepad2 className="h-5 w-5" />;
  if (t.includes('photo')) return <Camera className="h-5 w-5" />;
  if (t.includes('music') || t.includes('concert')) return <Music className="h-5 w-5" />;
  if (t.includes('art') || t.includes('museum') || t.includes('paint')) return <Palette className="h-5 w-5" />;
  if (t.includes('walk') || t.includes('hike') || t.includes('jog')) return <Footprints className="h-5 w-5" />;
  if (t.includes('swim') || t.includes('beach') || t.includes('pool')) return <Waves className="h-5 w-5" />;
  if (t.includes('climb') || t.includes('mountain')) return <Mountain className="h-5 w-5" />;
  if (t.includes('shop')) return <ShoppingBag className="h-5 w-5" />;
  if (t.includes('restaurant') || t.includes('eat') || t.includes('food')) return <UtensilsCrossed className="h-5 w-5" />;
  return <Sparkles className="h-5 w-5" />;
};

// Define what information this component needs
interface ActivitySuggestionsProps {
  activities: Activity[];  // List of activities to show
  loading: boolean;        // Are we still loading data?
}

// This component displays activity suggestions based on weather
export const ActivitySuggestions = ({ activities, loading }: ActivitySuggestionsProps) => {
  // If still loading, show placeholder cards with animation
  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500">
        {/* Show "thinking" message with animated star icon */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-accent animate-pulse" />
          <h2 className="text-2xl font-bold text-foreground">AI is thinking...</h2>
        </div>
        {/* Show 3 placeholder cards with pulsing animation */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 bg-gradient-card animate-pulse">
              <div className="space-y-3">
                {/* Gray bars that pulse to show loading */}
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // If no activities to show, don't display anything
  if (activities.length === 0) {
    return null;
  }

  // Show the list of activities
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with sparkles icon */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-accent" />
        <h2 className="text-2xl font-bold text-foreground">Recommended Activities</h2>
      </div>

      {/* Grid of activity cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Loop through each activity and create a card */}
        {activities.map((activity, index) => (
          <Card 
            key={index}
            className="p-5 bg-card border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-200 group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                  {getActivityIcon(activity.title)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {activity.title}
                    </h3>
                    <Badge variant="outline" className="text-xs flex items-center gap-1 shrink-0">
                      {getCategoryIcon(activity.category)}
                      {activity.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Import visual components we need
import { Card } from "@/components/ui/card";      // Card container for styling
import { Badge } from "@/components/ui/badge";    // Small label for category
import { Sparkles } from "lucide-react";           // Star icon

// Define what an activity looks like
interface Activity {
  title: string;        // Name of the activity
  description: string;  // Why it's good for this weather
  category: string;     // Type (Indoor, Outdoor, etc.)
}

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
            key={index}  // Unique identifier for React
            className="p-6 bg-gradient-card backdrop-blur-sm border-2 hover:border-primary hover:shadow-medium transition-smooth group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}  // Stagger the animation
          >
            <div className="space-y-4">
              {/* Top row: title and category badge */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-smooth">
                  {activity.title}
                </h3>
                {/* Small colored label showing category */}
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                  {activity.category}
                </Badge>
              </div>
              {/* Activity description */}
              <p className="text-muted-foreground leading-relaxed">
                {activity.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

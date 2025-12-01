import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Heart, Activity, Wind, Flower2 } from "lucide-react";

const fitnessLevels = ['beginner', 'intermediate', 'advanced'];
const asthmaSeverities = ['none', 'mild', 'moderate', 'severe'];
const commonAllergies = ['Pollen', 'Dust', 'Mold', 'Pet Dander', 'Ragweed'];
const healthConditions = ['Asthma', 'Heart Condition', 'Diabetes', 'Arthritis', 'Respiratory Issues'];
const activities = ['Running', 'Cycling', 'Swimming', 'Hiking', 'Gym', 'Yoga', 'Walking'];

export const ProfileSetup = ({ onComplete }: { onComplete?: () => void }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("intermediate");
  const [asthmaSeverity, setAsthmaSeverity] = useState("none");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          email: email.trim(),
          fitness_level: fitnessLevel,
          asthma_severity: asthmaSeverity,
          allergies: selectedAllergies,
          health_conditions: selectedConditions,
          preferred_activities: selectedActivities,
        });

      if (error) throw error;

      toast({
        title: "Profile Saved!",
        description: "Your health profile has been updated successfully",
      });

      if (onComplete) onComplete();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-2 shadow-medium">
      <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <User className="h-6 w-6 text-primary" />
        Health Profile Setup
      </h3>
      
      <div className="space-y-6">
        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5"
          />
        </div>

        {/* Fitness Level */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4" />
            Fitness Level
          </Label>
          <div className="flex gap-2">
            {fitnessLevels.map((level) => (
              <Button
                key={level}
                variant={fitnessLevel === level ? "default" : "outline"}
                onClick={() => setFitnessLevel(level)}
                className="capitalize"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Asthma Severity */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Wind className="h-4 w-4" />
            Asthma Severity
          </Label>
          <div className="flex gap-2 flex-wrap">
            {asthmaSeverities.map((severity) => (
              <Button
                key={severity}
                variant={asthmaSeverity === severity ? "default" : "outline"}
                onClick={() => setAsthmaSeverity(severity)}
                className="capitalize"
              >
                {severity}
              </Button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Flower2 className="h-4 w-4" />
            Allergies (Select all that apply)
          </Label>
          <div className="flex gap-2 flex-wrap">
            {commonAllergies.map((allergy) => (
              <Badge
                key={allergy}
                variant={selectedAllergies.includes(allergy) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSelection(allergy, selectedAllergies, setSelectedAllergies)}
              >
                {allergy}
              </Badge>
            ))}
          </div>
        </div>

        {/* Health Conditions */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4" />
            Health Conditions (Select all that apply)
          </Label>
          <div className="flex gap-2 flex-wrap">
            {healthConditions.map((condition) => (
              <Badge
                key={condition}
                variant={selectedConditions.includes(condition) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSelection(condition, selectedConditions, setSelectedConditions)}
              >
                {condition}
              </Badge>
            ))}
          </div>
        </div>

        {/* Preferred Activities */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4" />
            Preferred Activities (Select all that apply)
          </Label>
          <div className="flex gap-2 flex-wrap">
            {activities.map((activity) => (
              <Badge
                key={activity}
                variant={selectedActivities.includes(activity) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSelection(activity, selectedActivities, setSelectedActivities)}
              >
                {activity}
              </Badge>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full"
        >
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </Card>
  );
};

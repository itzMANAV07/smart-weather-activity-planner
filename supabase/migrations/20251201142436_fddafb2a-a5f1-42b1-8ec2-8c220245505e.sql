-- Create profiles table for user health preferences
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  email TEXT,
  health_conditions TEXT[] DEFAULT '{}',
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  preferred_activities TEXT[] DEFAULT '{}',
  asthma_severity TEXT CHECK (asthma_severity IN ('none', 'mild', 'moderate', 'severe')),
  allergies TEXT[] DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{"aqi": true, "uv": true, "pollen": true, "temperature": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (email = current_setting('request.headers')::json->>'email' OR user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (email = current_setting('request.headers')::json->>'email' OR user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (email = current_setting('request.headers')::json->>'email' OR user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();

-- Create notifications table
CREATE TABLE public.health_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'alert')),
  conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT false
);

-- Enable RLS on notifications
ALTER TABLE public.health_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.health_notifications FOR SELECT
  USING (profile_id IN (SELECT id FROM public.profiles WHERE email = current_setting('request.headers')::json->>'email' OR user_id = auth.uid()));

CREATE POLICY "System can insert notifications"
  ON public.health_notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.health_notifications FOR UPDATE
  USING (profile_id IN (SELECT id FROM public.profiles WHERE email = current_setting('request.headers')::json->>'email' OR user_id = auth.uid()));
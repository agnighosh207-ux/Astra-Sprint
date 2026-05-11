-- Mythic Sprint - Supabase Schema MVP Phase 1

-- 1. PROFILES TABLE
-- Stores user data linked to Supabase Auth
CREATE TABLE public.profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  display_name TEXT,
  total_distance NUMERIC DEFAULT 0.0,
  current_level INTEGER DEFAULT 1,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. RUNS TABLE
-- Stores user run history and metrics
CREATE TABLE public.runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  mission_id TEXT NOT NULL,
  mission_name TEXT NOT NULL,
  distance_km NUMERIC DEFAULT 0.0,
  duration_seconds INTEGER DEFAULT 0,
  pace_min_km NUMERIC DEFAULT 0.0,
  threat_level_avg INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for runs
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own runs"
  ON public.runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own runs"
  ON public.runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- 3. INVENTORY TABLE
-- Stores mythical artifacts collected during runs
CREATE TABLE public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  artifact_name TEXT NOT NULL,
  artifact_description TEXT,
  rarity TEXT DEFAULT 'common',
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for inventory
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inventory"
  ON public.inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory items"
  ON public.inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- 4. HELPER FUNCTION: SEED MOCK DATA
-- Run this function passing a valid user_id to generate 5 dummy past runs
CREATE OR REPLACE FUNCTION public.seed_mock_runs(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Run 1: The Vanara Scout
  INSERT INTO public.runs (user_id, mission_id, mission_name, distance_km, duration_seconds, pace_min_km, created_at)
  VALUES (p_user_id, 'm1', 'The Vanara Scout', 3.2, 1200, 6.25, NOW() - INTERVAL '5 days');

  -- Run 2: Escape the Rakshasa
  INSERT INTO public.runs (user_id, mission_id, mission_name, distance_km, duration_seconds, pace_min_km, created_at)
  VALUES (p_user_id, 'm1', 'The Vanara Scout', 4.5, 1500, 5.55, NOW() - INTERVAL '4 days');

  -- Run 3: Hooghly Stealth Run
  INSERT INTO public.runs (user_id, mission_id, mission_name, distance_km, duration_seconds, pace_min_km, created_at)
  VALUES (p_user_id, 'm2', 'Delivery to the Hooghly', 2.1, 800, 6.34, NOW() - INTERVAL '3 days');

  -- Run 4: Cyber-Kolkata Grid
  INSERT INTO public.runs (user_id, mission_id, mission_name, distance_km, duration_seconds, pace_min_km, created_at)
  VALUES (p_user_id, 'm3', 'Neon Market Run', 5.0, 1800, 6.00, NOW() - INTERVAL '2 days');

  -- Run 5: The Final Sprint
  INSERT INTO public.runs (user_id, mission_id, mission_name, distance_km, duration_seconds, pace_min_km, created_at)
  VALUES (p_user_id, 'm1', 'The Vanara Scout', 3.8, 1400, 6.14, NOW() - INTERVAL '1 day');

  -- Update profile total distance
  UPDATE public.profiles
  SET total_distance = (SELECT SUM(distance_km) FROM public.runs WHERE user_id = p_user_id)
  WHERE user_id = p_user_id;

  -- Insert a mock artifact
  INSERT INTO public.inventory (user_id, artifact_name, artifact_description, rarity)
  VALUES (p_user_id, 'Cyber-Gadace', 'A neon-infused energy mace relic from the old world.', 'epic');
END;
$$ LANGUAGE plpgsql;

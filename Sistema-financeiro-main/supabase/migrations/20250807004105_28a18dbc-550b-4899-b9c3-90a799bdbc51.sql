-- Fix security issue: Update function to have proper search_path
CREATE OR REPLACE FUNCTION public.user_owns_category(category_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
SELECT EXISTS (
  SELECT 1 FROM public.categorias
  WHERE id = category_uuid AND userid = auth.uid()
);
$function$;

-- Fix search path for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, nome, email, created_at, updated_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    now(),
    now()
  );
  RETURN new;
END;
$function$;

-- Review and strengthen RLS policies for profiles table
-- Remove existing policies to recreate them with better security
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create secure RLS policies for profiles table
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Note: We don't allow INSERT/DELETE on profiles as they're managed by triggers

-- Review and strengthen RLS policies for categorias table
DROP POLICY IF EXISTS "Users can delete own categories" ON public.categorias;
DROP POLICY IF EXISTS "Users can insert own categories" ON public.categorias;
DROP POLICY IF EXISTS "Users can update own categories" ON public.categorias;
DROP POLICY IF EXISTS "Users can view own categories" ON public.categorias;

CREATE POLICY "Users can view own categories"
  ON public.categorias
  FOR SELECT
  TO authenticated
  USING (auth.uid() = userid);

CREATE POLICY "Users can insert own categories"
  ON public.categorias
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid);

CREATE POLICY "Users can update own categories"
  ON public.categorias
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = userid)
  WITH CHECK (auth.uid() = userid);

CREATE POLICY "Users can delete own categories"
  ON public.categorias
  FOR DELETE
  TO authenticated
  USING (auth.uid() = userid);

-- Review and strengthen RLS policies for lembretes table
DROP POLICY IF EXISTS "Users can delete own reminders" ON public.lembretes;
DROP POLICY IF EXISTS "Users can insert own reminders" ON public.lembretes;
DROP POLICY IF EXISTS "Users can update own reminders" ON public.lembretes;
DROP POLICY IF EXISTS "Users can view own reminders" ON public.lembretes;

CREATE POLICY "Users can view own reminders"
  ON public.lembretes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = userid);

CREATE POLICY "Users can insert own reminders"
  ON public.lembretes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid);

CREATE POLICY "Users can update own reminders"
  ON public.lembretes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = userid)
  WITH CHECK (auth.uid() = userid);

CREATE POLICY "Users can delete own reminders"
  ON public.lembretes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = userid);

-- Review and strengthen RLS policies for transacoes table
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transacoes;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transacoes;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transacoes;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transacoes;

CREATE POLICY "Users can view own transactions"
  ON public.transacoes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = userid);

CREATE POLICY "Users can insert own transactions"
  ON public.transacoes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid AND user_owns_category(category_id));

CREATE POLICY "Users can update own transactions"
  ON public.transacoes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = userid)
  WITH CHECK (auth.uid() = userid AND user_owns_category(category_id));

CREATE POLICY "Users can delete own transactions"
  ON public.transacoes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = userid);

-- Review and strengthen RLS policies for subscriptions table
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can delete own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;

-- Keep service role access for webhook integrations
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- User access policies
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON public.subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure all tables have RLS enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
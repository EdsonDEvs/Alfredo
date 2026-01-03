-- Script para verificar a estrutura da tabela profiles
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar dados existentes
SELECT * FROM public.profiles LIMIT 5;

-- 3. Verificar se existe coluna userid ou id
SELECT 
  column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
AND column_name IN ('id', 'userid', 'user_id');

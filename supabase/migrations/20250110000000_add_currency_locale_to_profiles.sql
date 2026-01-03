-- Migration: Adicionar suporte a múltiplas moedas e locales
-- Adiciona campos currency e locale na tabela profiles

-- Adicionar colunas de moeda e locale
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL' CHECK (currency IN ('BRL', 'USD', 'EUR')),
ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'pt-BR' CHECK (locale IN ('pt-BR', 'en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'pt-PT'));

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_currency ON public.profiles(currency);
CREATE INDEX IF NOT EXISTS idx_profiles_locale ON public.profiles(locale);

-- Atualizar registros existentes para manter compatibilidade
UPDATE public.profiles 
SET currency = 'BRL', locale = 'pt-BR' 
WHERE currency IS NULL OR locale IS NULL;

-- Comentários para documentação
COMMENT ON COLUMN public.profiles.currency IS 'Moeda preferida do usuário: BRL, USD, EUR';
COMMENT ON COLUMN public.profiles.locale IS 'Locale preferido do usuário para formatação de números e datas';


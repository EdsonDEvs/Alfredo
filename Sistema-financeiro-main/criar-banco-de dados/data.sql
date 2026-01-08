create table public.transacoes (
  id bigint generated always as identity not null,
  created_at timestamp with time zone not null default now(),
  quando text null,
  estabelecimento character varying null,
  valor numeric null,
  detalhes text null,
  tipo character varying null,
  userid uuid not null,
  category_id uuid not null,
  categoria text null,
  constraint transacoes_pkey primary key (id),
  constraint transacoes_category_id_fkey foreign KEY (category_id) references categorias (id),
  constraint transacoes_userid_fkey foreign KEY (userid) references profiles (id)
) TABLESPACE pg_default;

create trigger trg_fill_transacoes_categoria_nome BEFORE INSERT
or
update OF category_id on transacoes for EACH row
execute FUNCTION fill_transacoes_categoria_nome ();



create table public.profiles (
  id uuid not null,
  username text null,
  nome text null,
  avatar_url text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  phone text null,
  whatsapp text null,
  email text null,
  ativo boolean null default true,
  assinaturaid character varying null,
  customerid character varying null,
  stripe_customer_id text null,
  subscription_id text null,
  subscription_status text null,
  subscription_end_date timestamp with time zone null,
  phone_number character varying(20) null,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id)
) TABLESPACE pg_default;

create index IF not exists idx_profiles_phone_number on public.profiles using btree (phone_number) TABLESPACE pg_default;

create index IF not exists idx_profiles_whatsapp on public.profiles using btree (whatsapp) TABLESPACE pg_default
where
  (whatsapp is not null);

create trigger trg_normalize_whatsapp BEFORE INSERT
or
update on profiles for EACH row
execute FUNCTION normalize_whatsapp ();





create table public.categorias (
  id uuid not null default gen_random_uuid (),
  userid uuid not null,
  nome text not null,
  tags text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  parent_id uuid null,
  is_main_category boolean null default false,
  icon text null,
  color text null,
  constraint categorias_pkey primary key (id),
  constraint categorias_parent_id_fkey foreign KEY (parent_id) references categorias (id) on delete CASCADE,
  constraint categorias_userid_fkey foreign KEY (userid) references auth.users (id)
) TABLESPACE pg_default;

create index IF not exists idx_categorias_parent_id on public.categorias using btree (parent_id) TABLESPACE pg_default;

create index IF not exists idx_categorias_main_category on public.categorias using btree (is_main_category) TABLESPACE pg_default;

create index IF not exists idx_categorias_userid on public.categorias using btree (userid) TABLESPACE pg_default;







create table public.lembretes (
  id bigint generated always as identity not null,
  created_at timestamp with time zone not null default now(),
  userid uuid null,
  descricao text null,
  data timestamp without time zone null,
  valor real null,
  constraint lembretes_pkey primary key (id),
  constraint lembretes_userid_fkey foreign KEY (userid) references profiles (id)
) TABLESPACE pg_default;
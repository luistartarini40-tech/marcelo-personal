-- Evolução Fit — schema inicial
-- Execute no Supabase: SQL Editor → New query → Run

-- Alunos
create table if not exists public.alunos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  email text not null default '',
  telefone text not null default '',
  data_nascimento text not null default '',
  genero text not null default '',
  objetivo text not null default '',
  observacoes text not null default '',
  criado_em timestamptz not null default now()
);

-- Treinos (programas)
create table if not exists public.treinos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  aluno_id uuid not null references public.alunos (id) on delete cascade,
  aluno_nome text not null default '',
  data_inicio text not null default '',
  data_termino text not null default '',
  objetivo text not null default '',
  observacoes text not null default '',
  criado_em timestamptz not null default now()
);

-- Fichas de treino
create table if not exists public.fichas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  treino_id uuid not null references public.treinos (id) on delete cascade,
  nome text not null,
  dias_da_semana text not null default '',
  exercicios jsonb not null default '[]'::jsonb,
  criado_em timestamptz not null default now()
);

-- Avaliações físicas
create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  aluno_id uuid not null references public.alunos (id) on delete cascade,
  aluno_nome text not null default '',
  data_avaliacao text not null default '',
  medidas jsonb not null default '{}'::jsonb,
  fotos jsonb not null default '{"frente":null,"lateral":null,"costas":null}'::jsonb,
  observacoes text not null default '',
  criado_em timestamptz not null default now()
);

-- Índices
create index if not exists alunos_user_id_idx on public.alunos (user_id);
create index if not exists treinos_user_id_idx on public.treinos (user_id);
create index if not exists treinos_aluno_id_idx on public.treinos (aluno_id);
create index if not exists fichas_user_id_idx on public.fichas (user_id);
create index if not exists fichas_treino_id_idx on public.fichas (treino_id);
create index if not exists avaliacoes_user_id_idx on public.avaliacoes (user_id);
create index if not exists avaliacoes_aluno_id_idx on public.avaliacoes (aluno_id);

-- RLS
alter table public.alunos enable row level security;
alter table public.treinos enable row level security;
alter table public.fichas enable row level security;
alter table public.avaliacoes enable row level security;

drop policy if exists alunos_own on public.alunos;
create policy alunos_own on public.alunos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists treinos_own on public.treinos;
create policy treinos_own on public.treinos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists fichas_own on public.fichas;
create policy fichas_own on public.fichas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists avaliacoes_own on public.avaliacoes;
create policy avaliacoes_own on public.avaliacoes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

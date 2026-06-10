create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  month text not null,
  count integer not null default 0 check (count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clerk_user_id, month)
);

create index if not exists ai_usage_clerk_user_month_idx
  on public.ai_usage (clerk_user_id, month);

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  month text not null,
  status text not null check (status in ('success', 'failed', 'timeout', 'refunded')),
  input_chars integer,
  keywords_count integer,
  error_message text,
  created_at timestamptz not null default now()
);

create or replace function public.reserve_ai_usage(
  p_user_id text,
  p_month text,
  p_limit integer
) returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_count integer;
begin
  insert into public.ai_usage (clerk_user_id, month, count)
  values (p_user_id, p_month, 0)
  on conflict (clerk_user_id, month) do nothing;

  select count into v_current_count
  from public.ai_usage
  where clerk_user_id = p_user_id and month = p_month
  for update;

  if v_current_count >= p_limit then
    return json_build_object('success', false, 'reason', 'limit_reached');
  end if;

  update public.ai_usage
  set count = count + 1,
      updated_at = now()
  where clerk_user_id = p_user_id and month = p_month;

  return json_build_object('success', true, 'remaining', p_limit - v_current_count - 1);
end;
$$;

create or replace function public.refund_ai_usage(
  p_user_id text,
  p_month text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.ai_usage
  set count = greatest(count - 1, 0),
      updated_at = now()
  where clerk_user_id = p_user_id and month = p_month;

  insert into public.ai_usage_events (clerk_user_id, month, status)
  values (p_user_id, p_month, 'refunded');
end;
$$;

alter table public.ai_usage enable row level security;
alter table public.ai_usage_events enable row level security;

create extension if not exists pgcrypto;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  plan text not null check (plan in ('pro')),
  interval text check (interval in ('monthly', 'yearly')),
  status text not null check (
    status in (
      'active',
      'trialing',
      'past_due',
      'canceled',
      'unpaid',
      'incomplete',
      'incomplete_expired',
      'paused',
      'expired'
    )
  ),
  provider text not null default 'creem' check (provider in ('creem')),
  provider_customer_id text,
  provider_subscription_id text,
  provider_checkout_id text,
  product_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clerk_user_id),
  unique (provider, provider_subscription_id)
);

create index if not exists subscriptions_clerk_user_id_idx
  on public.subscriptions (clerk_user_id);

create index if not exists subscriptions_provider_customer_id_idx
  on public.subscriptions (provider_customer_id);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  provider text not null default 'creem' check (provider in ('creem')),
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;

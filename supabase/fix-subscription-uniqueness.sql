with ranked_subscriptions as (
  select
    id,
    row_number() over (
      partition by clerk_user_id
      order by updated_at desc nulls last, current_period_end desc nulls last, created_at desc
    ) as row_rank
  from public.subscriptions
)
delete from public.subscriptions
where id in (
  select id
  from ranked_subscriptions
  where row_rank > 1
);

create unique index if not exists subscriptions_clerk_user_id_unique_idx
  on public.subscriptions (clerk_user_id);

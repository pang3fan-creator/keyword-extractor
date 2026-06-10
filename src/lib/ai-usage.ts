import { getSupabaseAdmin } from '@/lib/supabase-admin';

const DEFAULT_AI_MONTHLY_LIMIT = 2_000;

export type AIUsageReservation = {
  remaining: number;
  limit: number;
  resetAt: string;
};

type ReserveAIUsageResponse = {
  success?: boolean;
  remaining?: number;
  reason?: string;
};

export function getAIUsageLimit() {
  const configuredLimit = Number(process.env.AI_MONTHLY_LIMIT);
  if (!Number.isInteger(configuredLimit) || configuredLimit <= 0) {
    return DEFAULT_AI_MONTHLY_LIMIT;
  }
  return configuredLimit;
}

export function getAIUsageMonth(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export function getAIUsageResetAt(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)).toISOString();
}

export async function reserveAIUsage(clerkUserId: string): Promise<AIUsageReservation | null> {
  const now = new Date();
  const limit = getAIUsageLimit();
  const { data, error } = await getSupabaseAdmin().rpc('reserve_ai_usage', {
    p_user_id: clerkUserId,
    p_month: getAIUsageMonth(now),
    p_limit: limit,
  });

  if (error) throw error;

  const result = data as ReserveAIUsageResponse | null;
  if (!result?.success) return null;

  return {
    remaining: Math.max(0, Number(result.remaining) || 0),
    limit,
    resetAt: getAIUsageResetAt(now),
  };
}

export async function refundAIUsage(clerkUserId: string) {
  const { error } = await getSupabaseAdmin().rpc('refund_ai_usage', {
    p_user_id: clerkUserId,
    p_month: getAIUsageMonth(),
  });

  if (error) throw error;
}

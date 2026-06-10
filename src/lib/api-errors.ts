export type APIErrorCode =
  | 'INVALID_JSON'
  | 'TEXT_REQUIRED'
  | 'TEXT_TOO_LONG'
  | 'INVALID_URL'
  | 'ROBOTS_BLOCKED'
  | 'FETCH_TIMEOUT'
  | 'FETCH_FAILED'
  | 'NON_HTML_CONTENT'
  | 'EMPTY_CONTENT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED'
  | 'INVALID_PLAN'
  | 'PAYMENT_CONFIG_MISSING'
  | 'CHECKOUT_FAILED'
  | 'ALREADY_SUBSCRIBED'
  | 'SUBSCRIPTION_NOT_FOUND'
  | 'PORTAL_FAILED'
  | 'WEBHOOK_SIGNATURE_INVALID'
  | 'WEBHOOK_PROCESSING_FAILED'
  | 'PRO_REQUIRED'
  | 'AI_LIMIT_REACHED'
  | 'AI_TIMEOUT'
  | 'AI_FAILED'
  | 'AI_CONFIG_MISSING';

export interface APIErrorBody {
  errorCode: APIErrorCode;
  error: string;
}

export const API_ERROR_MESSAGES: Record<APIErrorCode, string> = {
  INVALID_JSON: 'Invalid JSON body.',
  TEXT_REQUIRED: 'Text is required.',
  TEXT_TOO_LONG: 'Text exceeds the allowed character limit.',
  INVALID_URL: 'A valid URL is required.',
  ROBOTS_BLOCKED: 'This URL is blocked by robots.txt.',
  FETCH_TIMEOUT: 'URL fetch timed out.',
  FETCH_FAILED: 'Unable to fetch URL content.',
  NON_HTML_CONTENT: 'Only HTML pages can be extracted.',
  EMPTY_CONTENT: 'No readable page content found.',
  RATE_LIMIT_EXCEEDED: 'Daily free extraction limit reached.',
  UNAUTHORIZED: 'Authentication is required.',
  INVALID_PLAN: 'A valid billing interval is required.',
  PAYMENT_CONFIG_MISSING: 'Payment configuration is missing.',
  CHECKOUT_FAILED: 'Unable to start checkout.',
  ALREADY_SUBSCRIBED: 'You already have an active subscription.',
  SUBSCRIPTION_NOT_FOUND: 'No subscription was found.',
  PORTAL_FAILED: 'Unable to open billing management.',
  WEBHOOK_SIGNATURE_INVALID: 'Invalid webhook signature.',
  WEBHOOK_PROCESSING_FAILED: 'Unable to process webhook.',
  PRO_REQUIRED: 'Pro subscription is required for AI extraction.',
  AI_LIMIT_REACHED: 'AI extraction limit reached this month.',
  AI_TIMEOUT: 'AI extraction timed out.',
  AI_FAILED: 'AI extraction failed.',
  AI_CONFIG_MISSING: 'AI extraction is not configured.',
};

export function apiError(errorCode: APIErrorCode, error = API_ERROR_MESSAGES[errorCode]) {
  return { errorCode, error };
}

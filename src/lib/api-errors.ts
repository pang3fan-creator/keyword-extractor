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
  | 'RATE_LIMIT_EXCEEDED';

export interface APIErrorBody {
  errorCode: APIErrorCode;
  error: string;
}

export const API_ERROR_MESSAGES: Record<APIErrorCode, string> = {
  INVALID_JSON: 'Invalid JSON body.',
  TEXT_REQUIRED: 'Text is required.',
  TEXT_TOO_LONG: 'Text must be 50,000 characters or fewer.',
  INVALID_URL: 'A valid URL is required.',
  ROBOTS_BLOCKED: 'This URL is blocked by robots.txt.',
  FETCH_TIMEOUT: 'URL fetch timed out.',
  FETCH_FAILED: 'Unable to fetch URL content.',
  NON_HTML_CONTENT: 'Only HTML pages can be extracted.',
  EMPTY_CONTENT: 'No readable page content found.',
  RATE_LIMIT_EXCEEDED: 'Daily free extraction limit reached.',
};

export function apiError(errorCode: APIErrorCode, error = API_ERROR_MESSAGES[errorCode]) {
  return { errorCode, error };
}

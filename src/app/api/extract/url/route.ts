import { NextResponse } from 'next/server';
import { extractKeywords, type KeywordExtractionOptions } from '@/lib/keyword-extractor';
import { checkRobotsTxt } from '@/lib/robots-checker';
import { fetchURLContent, isSafeFetchUrl } from '@/lib/url-fetcher';

interface URLExtractionBody {
  url?: unknown;
  options?: KeywordExtractionOptions;
}

export async function POST(request: Request) {
  let body: URLExtractionBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (typeof body.url !== 'string' || !isSafeFetchUrl(body.url)) {
    return NextResponse.json({ error: 'A valid URL is required.' }, { status: 400 });
  }

  const parsedUrl = new URL(body.url);
  const normalizedUrl = parsedUrl.toString();
  const allowedByRobots = await checkRobotsTxt(normalizedUrl);

  if (!allowedByRobots) {
    return NextResponse.json({ error: 'This URL is blocked by robots.txt.' }, { status: 403 });
  }

  const fetchResult = await fetchURLContent(normalizedUrl);
  if (!fetchResult.success) {
    return NextResponse.json({ error: fetchResult.error }, { status: 400 });
  }

  return NextResponse.json({
    ...extractKeywords(fetchResult.content, body.options),
    sourceUrl: normalizedUrl,
    pageTitle: fetchResult.title,
  });
}

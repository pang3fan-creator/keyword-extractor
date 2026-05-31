import { NextResponse } from 'next/server';
import { extractKeywords, type KeywordExtractionOptions } from '@/lib/keyword-extractor';

const MAX_TEXT_LENGTH = 50_000;

interface TextExtractionBody {
  text?: unknown;
  options?: KeywordExtractionOptions;
}

export async function POST(request: Request) {
  let body: TextExtractionBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (typeof body.text !== 'string' || body.text.trim().length === 0) {
    return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
  }

  if (body.text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: 'Text must be 50,000 characters or fewer.' },
      { status: 400 },
    );
  }

  return NextResponse.json(extractKeywords(body.text, body.options));
}

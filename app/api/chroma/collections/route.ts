import { DATABASE, TENANT } from '@/app/shared/consts';
import { NextResponse, NextRequest } from 'next/server';

export async function GET() {
  const res = await fetch(`http://localhost:8000/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections`);

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `${res.status}: ${text}` });
  }

  const data = await res.json();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const { name } = await request.json()

  const res = await fetch(`http://localhost:8000/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  const data = await res.json()
  return NextResponse.json({ data })
}
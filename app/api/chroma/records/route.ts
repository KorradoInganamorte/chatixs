import { NextResponse, NextRequest } from "next/server";
import { DATABASE, TENANT } from "@/app/shared/consts";

export function mockEmbedding(dim = 16): number[] {
  return Array.from({ length: dim }, () => Math.random() * 2 - 1);
}

export async function POST(request: NextRequest) {
  const { id, contents } = await request.json();

  let documents: string = contents;
  if (Array.isArray(contents)) {
    documents = contents
      .map((content) => JSON.stringify(content))
      .join(",\n");
  }

  const res = await fetch(
    `http://localhost:8000/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections/${id}/add`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: [id],
        documents: [documents],
        embeddings: [mockEmbedding(16)],
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `${res.status}: ${text}` });
  }

  const data = await res.json();
  return NextResponse.json({ success: true, data });
}
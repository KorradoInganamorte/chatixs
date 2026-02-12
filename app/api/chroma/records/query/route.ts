import { DATABASE, TENANT } from "@/app/shared/consts";
import { NextRequest, NextResponse } from "next/server";
import { mockEmbedding } from "../route";

export async function POST(request: NextRequest) {
  const { id } = await request.json();

  const queryEmbedding = mockEmbedding(16);

  const res = await fetch(
    `http://localhost:8000/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections/${id}/query`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query_embeddings: [queryEmbedding],
        n_results: 5,
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

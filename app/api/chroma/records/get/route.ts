import { DATABASE, TENANT } from "@/app/shared/consts";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { id } = await request.json();

  const res = await fetch(`http://localhost:8000/api/v2/tenants/${TENANT}/databases/${DATABASE}/collections/${id}/get`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      offset: 0,
      limit: 10,
    }),
  });

  const data = await res.json();
  return NextResponse.json({ success: true, data });
}

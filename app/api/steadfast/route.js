import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch("https://portal.packzy.com/api/v1/create_order", {
      method: "POST",
      headers: {
        "Api-Key": process.env.STEADFAST_API_KEY,
        "Secret-Key": process.env.STEADFAST_SECRET_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

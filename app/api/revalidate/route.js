import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { tags } = body;

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { message: "Tags are required" },
        { status: 400 }
      );
    }

    tags.forEach(tag => revalidateTag(tag));

    return NextResponse.json({
      success: true,
      revalidated: tags,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

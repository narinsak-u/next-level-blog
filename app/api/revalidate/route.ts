import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 401 }
    );
  }

  if (!path) {
    return Response.json({
      revalidated: false,
      now: Date.now(),
      message: "Missing path to revalidate",
    });
  }

  revalidatePath(path);
  return Response.json({ revalidated: true, now: Date.now() });
}

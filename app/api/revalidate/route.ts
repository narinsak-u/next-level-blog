import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

type RevalidationPayload = {
  paths?: string[];
  tags?: string[];
};

const isNonEmptyStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every((entry) => typeof entry === "string" && entry.trim().length > 0);

const isRevalidationPayload = (value: unknown): value is RevalidationPayload => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const { paths, tags } = value as Record<string, unknown>;
  const hasValidPaths = paths === undefined || isNonEmptyStringArray(paths);
  const hasValidTags = tags === undefined || isNonEmptyStringArray(tags);

  return (
    hasValidPaths &&
    hasValidTags &&
    ((Array.isArray(paths) && paths.length > 0) ||
      (Array.isArray(tags) && tags.length > 0))
  );
};

export async function POST(request: NextRequest) {
  const expectedAuthorization = process.env.REVALIDATION_SECRET
    ? `Bearer ${process.env.REVALIDATION_SECRET}`
    : null;

  if (
    expectedAuthorization === null ||
    request.headers.get("authorization") !== expectedAuthorization
  ) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, {
      status: 401,
    });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { revalidated: false, message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  if (!isRevalidationPayload(payload)) {
    return Response.json(
      { revalidated: false, message: "Invalid revalidation payload" },
      { status: 400 },
    );
  }

  for (const path of payload.paths ?? []) {
    revalidatePath(path);
  }
  for (const tag of payload.tags ?? []) {
    revalidateTag(tag, "max");
  }

  return Response.json({ revalidated: true });
}

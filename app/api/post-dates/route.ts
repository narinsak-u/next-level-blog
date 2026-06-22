import { NextResponse } from "next/server";
import { fetchPostDates } from "@/app/posts/actions/posts";

export async function GET() {
  const result = await fetchPostDates();
  return NextResponse.json(result);
}
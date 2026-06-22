import { NextRequest } from "next/server";
import { streamText } from "ai";
import { llm, getDefaultModel } from "@/lib/llm-provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { headers: cors });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400, headers: cors },
      );
    }

    const result = streamText({
      model: llm(getDefaultModel()),
      prompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ text: chunk })}\n\n`,
              ),
            );
          }
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Connection": "keep-alive",
        ...cors,
      },
    });
  } catch (error: unknown) {
    console.error("AI summary error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    const isQuota =
      message.toLowerCase().includes("insufficient_quota") ||
      message.toLowerCase().includes("quota");

    return Response.json(
      {
        error: isQuota
          ? "ขออภัยครับ ตอนนี้โควต้า AI ของเราหมดชั่วคราว กรุณาลองใหม่ในภายหลัง หรืออ่านบทความตัวเต็มได้ครับ"
          : "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้งครับ",
        ...(isQuota ? { code: "quota_exceeded" } : {}),
      },
      { status: isQuota ? 429 : 500, headers: cors },
    );
  }
}

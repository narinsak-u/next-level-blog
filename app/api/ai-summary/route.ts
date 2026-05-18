import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4o-mini");

export const runtime = "nodejs";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body.prompt;

    if (!prompt) {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const result = streamText({
      model,
      prompt,
    });

    // We must catch the error BEFORE returning the Response object
    // to avoid sending a 200 OK when a quota error occurs.
    const textStream = result.textStream;
    const iterator = textStream[Symbol.asyncIterator]();

    let firstResult;
    try {
      firstResult = await iterator.next();
      
      // Check if the value itself contains an error (some SDK versions/models)
      if (!firstResult.done && firstResult.value) {
        const valStr = String(firstResult.value).toLowerCase();
        if (valStr.includes("insufficient_quota") || valStr.includes("exceeded your current quota")) {
          throw { error: { code: "insufficient_quota" }, message: valStr };
        }
      }
    } catch (error: any) {
      console.error("AI stream error caught during peek:", error);
      
      // Determine if it's a quota/rate limit error
      const errorStr = String(error?.message || error?.error?.message || "").toLowerCase();
      const isQuotaError = 
        error?.error?.code === "insufficient_quota" || 
        error?.error?.type === "insufficient_quota" ||
        error?.message?.includes("insufficient_quota") ||
        errorStr.includes("insufficient_quota") ||
        errorStr.includes("exceeded your current quota") ||
        error?.status === 429;

      if (isQuotaError) {
        return Response.json(
          { 
            error: "ขออภัยครับ ตอนนี้โควต้า AI ของเราหมดชั่วคราว กรุณาลองใหม่ในภายหลัง หรืออ่านบทความตัวเต็มได้ครับ",
            code: "quota_exceeded"
          },
          { status: 429, headers: { "Access-Control-Allow-Origin": "*" } }
        );
      }
      
      return Response.json(
        { error: "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้งครับ" },
        { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // If we reached here, the first chunk was successful or the stream is empty
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (firstResult && !firstResult.done) {
            const firstData = JSON.stringify({ text: firstResult.value });
            controller.enqueue(new TextEncoder().encode(`data: ${firstData}\n\n`));

            while (true) {
              const { done, value } = await iterator.next();
              if (done) break;
              const data = JSON.stringify({ text: value });
              controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error during iteration:", error);
          // If headers were already sent (200 OK), we can only close the stream with error
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error: any) {
    console.error("AI general error:", error);
    return Response.json(
      { error: "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้งครับ" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

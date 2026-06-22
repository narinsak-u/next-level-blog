# example case

```
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { searchDocuments } from "@/lib/services/rag-pipeline";
import { llm, getDefaultModel } from "@/lib/services/llm-provider";
import { PALI_EXPERT_SYSTEM_PROMPT } from "@/lib/chat/pali-system-prompt";
import { formatContext, type DocumentMatch } from "@/lib/services/vector-store";
import { isQuotaError } from "@/lib/services/quiz-pipeline";

export const runtime = "nodejs";
export const maxDuration = 120;

// Append retrieved textbook context to the system prompt for grounded answers
function buildSystemWithContext(baseSystem: string, context: string): string {
  return `${baseSystem}\n\nContext from Pali textbook corpus:\n${context}\n\nUse this context to answer the question. Do not search again — you already have the necessary information.`;
}

const MAX_STEPS = 5;
const ANSWER_THRESHOLD = 150;

// Stop streaming when the model has generated a substantial answer (or hits max steps)
function stopWhenAnswered({ steps }: { steps: Array<{ text: string }> }) {
  if (steps.length >= MAX_STEPS) return true;
  const lastText = steps[steps.length - 1]?.text ?? "";
  return lastText.length > ANSWER_THRESHOLD;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Wrap the LLM call in a UI-aware message stream for real-time client updates
    const stream = createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        let searchCompleted = false;
        let cachedResult: { matches: DocumentMatch[] } | null = null;
        let suggestionsGenerated = false;

        // Signal the client that the model is processing the question
        writer.write({
          type: "data-status",
          data: { phase: "thinking" },
        });

        // Core RAG: LLM with tools for searching the textbook corpus and suggesting follow-ups
        const result = streamText({
          model: llm(getDefaultModel()),
          system: PALI_EXPERT_SYSTEM_PROMPT,
          messages: convertToModelMessages(messages),
          stopWhen: stopWhenAnswered,
          tools: {
            // Pinecone vector search — runs exactly once per question to avoid embedding costs
            searchDocs: tool({
              description:
                "Search the Pali textbook corpus for relevant passages.",
              inputSchema: z.object({ query: z.string().min(1) }),
              execute: async ({ query }, { toolCallId }) => {
                // Return cached results on repeated calls — prevents duplicate Pinecone queries
                if (searchCompleted && cachedResult) {
                  writer.write({
                    type: "data-task",
                    data: {
                      id: toolCallId,
                      label: "ค้นหาเอกสาร",
                      status: "done",
                      matchCount: cachedResult.matches.length,
                    },
                  });
                  return cachedResult;
                }
                searchCompleted = true;
                // Notify client that search has started
                writer.write({
                  type: "data-task",
                  data: {
                    id: toolCallId,
                    label: "ค้นหาเอกสาร",
                    status: "running",
                    query,
                  },
                });
                try {
                  const { matches } = await searchDocuments(query, {
                    topK: 10,
                  });
                  cachedResult = { matches };
                  // Notify client that search completed with N matches
                  writer.write({
                    type: "data-task",
                    data: {
                      id: toolCallId,
                      label: "ค้นหาเอกสาร",
                      status: "done",
                      matchCount: matches.length,
                    },
                  });
                  const excerpts = matches.map((m) =>
                    m.text.slice(0, 120).trim(),
                  );
                  // Show matched excerpts to the user
                  writer.write({
                    type: "data-reasoning",
                    data: {
                      summary: `พบเอกสารที่เกี่ยวข้อง ${matches.length} รายการ`,
                      excerpts,
                    },
                  });
                  return { matches };
                } catch (e: unknown) {
                  const message =
                    e instanceof Error ? e.message : "search failed";
                  cachedResult = { matches: [] };
                  writer.write({
                    type: "data-task",
                    data: {
                      id: toolCallId,
                      label: "ค้นหาเอกสาร",
                      status: "error",
                      message,
                    },
                  });
                  return { matches: [] };
                }
              },
            }),
            // Generate 3 Thai follow-up questions after the answer
            suggestQuestions: tool({
              description:
                "Generate 3 follow-up questions for the user based on the conversation.",
              inputSchema: z.object({
                suggestions: z.array(z.string().min(1)).min(1).max(3),
              }),
              execute: async ({ suggestions }) => {
                if (suggestionsGenerated) return { ok: false };
                suggestionsGenerated = true;
                if (suggestions.length === 0) return { ok: false };
                writer.write({
                  type: "data-suggestions",
                  data: { suggestions },
                });
                return { ok: true };
              },
            }),
          },
          // After search completes: inject context into system prompt and disable search tool
          prepareStep: async ({ steps }) => {
            for (const step of steps) {
              for (const tr of step.toolResults) {
                if (
                  tr.toolName === "searchDocs" &&
                  tr.output &&
                  typeof tr.output === "object" &&
                  "matches" in tr.output
                ) {
                  const matches = (tr.output as { matches: DocumentMatch[] })
                    .matches;
                  if (matches.length > 0) {
                    const context = formatContext(matches);
                    writer.write({
                      type: "data-status",
                      data: { phase: "answering" },
                    });
                    return {
                      system: buildSystemWithContext(
                        PALI_EXPERT_SYSTEM_PROMPT,
                        context,
                      ),
                      // Remove searchDocs so model cannot call it again — saves cost
                      activeTools: ["suggestQuestions"] as const,
                    };
                  }
                }
              }
            }
            return undefined;
          },
        });

        // Merge LLM output into the UI stream and wait for completion
        writer.merge(result.toUIMessageStream({ sendReasoning: false }));
        await result.consumeStream();
      },
    });

    return createUIMessageStreamResponse({ stream }) as unknown as Response;
  } catch (error: unknown) {
    console.error("Question API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if (isQuotaError(error)) {
      return new Response(
        JSON.stringify({
          error: "insufficient_quota",
          message: "You exceeded your current quota",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(JSON.stringify({ error: "internal_error", message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

```

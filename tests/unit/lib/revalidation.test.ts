import { beforeEach, describe, expect, it, vi } from "vitest";

const { revalidatePathMock, revalidateTagMock } = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
  revalidateTagMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
  revalidateTag: revalidateTagMock,
}));

import { POST } from "@/app/api/revalidate/route";

const secret = "test-revalidation-secret";

function request(
  body: unknown,
  authorization = `Bearer ${secret}`,
): Request {
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: {
      authorization,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    process.env.REVALIDATION_SECRET = secret;
    vi.clearAllMocks();
  });

  it("rejects missing or invalid bearer credentials", async () => {
    const missing = await POST(request({ paths: ["/posts/example"] }, ""));
    const invalid = await POST(
      request({ paths: ["/posts/example"] }, "Bearer wrong-secret"),
    );

    expect(missing.status).toBe(401);
    expect(invalid.status).toBe(401);
    expect(revalidatePathMock).not.toHaveBeenCalled();
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });

  it("rejects malformed payloads and empty invalidation requests", async () => {
    const malformed = new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: {
        authorization: `Bearer ${secret}`,
        "content-type": "application/json",
      },
      body: "not-json",
    });
    const invalidPayloads = await Promise.all([
      POST(malformed),
      POST(request([])),
      POST(request({ paths: [""], tags: ["notion:posts"] })),
      POST(request({ paths: ["/posts/example"], tags: [42] })),
      POST(request({})),
    ]);

    expect(invalidPayloads.every((response) => response.status === 400)).toBe(
      true,
    );
    expect(revalidatePathMock).not.toHaveBeenCalled();
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });

  it("revalidates every requested path and cache tag", async () => {
    const response = await POST(
      request({
        paths: ["/posts/example", "/tags/typescript"],
        tags: ["notion:posts", "notion:post:post-1"],
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ revalidated: true });
    expect(revalidatePathMock).toHaveBeenNthCalledWith(1, "/posts/example");
    expect(revalidatePathMock).toHaveBeenNthCalledWith(2, "/tags/typescript");
    expect(revalidateTagMock).toHaveBeenNthCalledWith(1, "notion:posts", "max");
    expect(revalidateTagMock).toHaveBeenNthCalledWith(
      2,
      "notion:post:post-1",
      "max",
    );
  });
});

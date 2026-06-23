import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useVideoWithPlaceholder from "@/hooks/use-video-with-placeholder";

function createMockVideo(readyState = 0) {
  const video = document.createElement("video") as HTMLVideoElement;
  const playSpy = vi.fn().mockResolvedValue(undefined);
  const loadSpy = vi.fn();

  let canplayHandler: (() => void) | null = null;

  video.play = playSpy;
  video.load = loadSpy;
  video.addEventListener = vi.fn((event, handler) => {
    if (event === "canplay") {
      canplayHandler = handler as () => void;
    }
  }) as HTMLVideoElement["addEventListener"];
  video.removeEventListener = vi.fn();

  Object.defineProperty(video, "readyState", {
    value: readyState,
    writable: true,
    configurable: true,
  });

  return {
    video,
    playSpy,
    loadSpy,
    triggerCanplay: () => canplayHandler?.(),
  };
}

describe("useVideoWithPlaceholder", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("VP-001: Initial state", () => {
    it("returns videoReady as false", () => {
      const { result } = renderHook(() =>
        useVideoWithPlaceholder({ src: "/video.mp4" }),
      );

      expect(result.current.videoReady).toBe(false);
    });

    it("returns a ref with null current", () => {
      const { result } = renderHook(() =>
        useVideoWithPlaceholder({ src: "/video.mp4" }),
      );

      expect(result.current.videoRef).toBeDefined();
      expect(result.current.videoRef.current).toBeNull();
    });
  });

  describe("VP-002: Null ref guard", () => {
    it("exits early without error when ref is null", () => {
      const addSpy = vi.fn();
      const proto = HTMLVideoElement.prototype.addEventListener;
      HTMLVideoElement.prototype.addEventListener = addSpy;

      const { unmount } = renderHook(() =>
        useVideoWithPlaceholder({ src: "/video.mp4" }),
      );

      expect(addSpy).not.toHaveBeenCalled();
      HTMLVideoElement.prototype.addEventListener = proto;
      unmount();
    });
  });

  describe("VP-003: readyState >= 3 (already buffered)", () => {
    it("calls play and sets videoReady immediately", () => {
      const { video, playSpy } = createMockVideo(3);

      const { result, rerender } = renderHook(
        ({ src }: { src: string }) => useVideoWithPlaceholder({ src }),
        { initialProps: { src: "/v1.mp4" } },
      );

      result.current.videoRef.current = video;
      rerender({ src: "/v2.mp4" });

      expect(playSpy).toHaveBeenCalled();
      expect(result.current.videoReady).toBe(true);
    });

    it("does not attach canplay listener when already ready", () => {
      const { video } = createMockVideo(3);

      const { result, rerender } = renderHook(
        ({ src }: { src: string }) => useVideoWithPlaceholder({ src }),
        { initialProps: { src: "/v1.mp4" } },
      );

      result.current.videoRef.current = video;
      rerender({ src: "/v2.mp4" });

      expect(video.addEventListener).not.toHaveBeenCalled();
    });
  });

  describe("VP-004: Canplay event handling", () => {
    it("sets videoReady and calls play when canplay fires", async () => {
      const { video, playSpy, triggerCanplay } = createMockVideo(0);

      const { result, rerender } = renderHook(
        ({ src }: { src: string }) => useVideoWithPlaceholder({ src }),
        { initialProps: { src: "/v1.mp4" } },
      );

      result.current.videoRef.current = video;
      rerender({ src: "/v2.mp4" });

      triggerCanplay();

      await vi.waitFor(() => {
        expect(playSpy).toHaveBeenCalled();
        expect(result.current.videoReady).toBe(true);
      });
    });

    it("calls video.load() when waiting for canplay", () => {
      const { video, loadSpy } = createMockVideo(0);

      const { result, rerender } = renderHook(
        ({ src }: { src: string }) => useVideoWithPlaceholder({ src }),
        { initialProps: { src: "/v1.mp4" } },
      );

      result.current.videoRef.current = video;
      rerender({ src: "/v2.mp4" });

      expect(loadSpy).toHaveBeenCalled();
    });
  });

  describe("VP-005: Autoplay rejection tolerance", () => {
    it("swallows play rejection without throwing", async () => {
      const { video, triggerCanplay } = createMockVideo(0);
      video.play = vi.fn().mockRejectedValue(new Error("autoplay blocked"));

      const { result, rerender } = renderHook(
        ({ src }: { src: string }) => useVideoWithPlaceholder({ src }),
        { initialProps: { src: "/v1.mp4" } },
      );

      result.current.videoRef.current = video;
      rerender({ src: "/v2.mp4" });

      expect(() => triggerCanplay()).not.toThrow();

      await vi.waitFor(() => {
        expect(result.current.videoReady).toBe(true);
      });
    });
  });

  describe("VP-006: Cleanup", () => {
    it("removes canplay listener on src change", () => {
      const { video } = createMockVideo(0);
      const removeSpy = vi.fn();
      video.removeEventListener = removeSpy;

      const { result, rerender } = renderHook(
        ({ src }: { src: string }) => useVideoWithPlaceholder({ src }),
        { initialProps: { src: "/v1.mp4" } },
      );

      result.current.videoRef.current = video;
      rerender({ src: "/v2.mp4" });
      rerender({ src: "/v3.mp4" });

      expect(removeSpy).toHaveBeenCalledWith("canplay", expect.any(Function));
    });

    it("removes canplay listener on unmount", () => {
      const { video } = createMockVideo(0);
      const removeSpy = vi.fn();
      video.removeEventListener = removeSpy;

      const { result, rerender, unmount } = renderHook(
        ({ src }: { src: string }) => useVideoWithPlaceholder({ src }),
        { initialProps: { src: "/v1.mp4" } },
      );

      result.current.videoRef.current = video;
      rerender({ src: "/v2.mp4" });
      unmount();

      expect(removeSpy).toHaveBeenCalledWith("canplay", expect.any(Function));
    });
  });

  describe("VP-007: Effect re-runs on src change", () => {
    it("re-attaches listener when src changes", () => {
      const v1 = createMockVideo(0);
      const v2 = createMockVideo(0);

      const { result, rerender } = renderHook(
        ({ src }: { src: string }) => useVideoWithPlaceholder({ src }),
        { initialProps: { src: "/v1.mp4" } },
      );

      result.current.videoRef.current = v1.video;
      rerender({ src: "/v2.mp4" });
      expect(v1.video.addEventListener).toHaveBeenCalledWith(
        "canplay",
        expect.any(Function),
        { once: true },
      );

      result.current.videoRef.current = v2.video;
      rerender({ src: "/v3.mp4" });
      expect(v2.video.addEventListener).toHaveBeenCalledWith(
        "canplay",
        expect.any(Function),
        { once: true },
      );
    });
  });
});

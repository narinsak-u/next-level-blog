import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { AISummaryPopup } from "@/app/posts/components/AISummaryPopup";

describe("AISummaryPopup", () => {
  describe("AI-101: Visibility", () => {
    it("renders nothing when isOpen is false", () => {
      const { container } = render(
        <AISummaryPopup
          isOpen={false}
          summary=""
          isLoading={false}
          error={null}
          onClose={() => {}}
          onRetry={() => {}}
        />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("AI-102: Loading state", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("renders first loading step initially", () => {
      render(
        <AISummaryPopup
          isOpen={true}
          summary=""
          isLoading={true}
          error={null}
          onClose={() => {}}
          onRetry={() => {}}
        />,
      );

      expect(screen.getByText("กำลังอ่านเนื้อหา...")).toBeTruthy();
    });

    it("advances through loading steps over time", () => {
      render(
        <AISummaryPopup
          isOpen={true}
          summary=""
          isLoading={true}
          error={null}
          onClose={() => {}}
          onRetry={() => {}}
        />,
      );

      act(() => {
        vi.advanceTimersByTime(2500);
      });
      expect(screen.getByText("วิเคราะห์เนื้อหา...")).toBeTruthy();

      act(() => {
        vi.advanceTimersByTime(2500);
      });
      expect(screen.getByText("กำลังสรุป...")).toBeTruthy();

      act(() => {
        vi.advanceTimersByTime(2500);
      });
      expect(screen.getByText("เกือบเสร็จแล้ว...")).toBeTruthy();
    });

    it("cycles back to first step", () => {
      render(
        <AISummaryPopup
          isOpen={true}
          summary=""
          isLoading={true}
          error={null}
          onClose={() => {}}
          onRetry={() => {}}
        />,
      );

      act(() => {
        vi.advanceTimersByTime(10000);
      });
      expect(screen.getByText("กำลังอ่านเนื้อหา...")).toBeTruthy();
    });

    it("renders step indicator dots", () => {
      const { container } = render(
        <AISummaryPopup
          isOpen={true}
          summary=""
          isLoading={true}
          error={null}
          onClose={() => {}}
          onRetry={() => {}}
        />,
      );

      const dots = container.querySelectorAll(".w-2.h-2.rounded-full");
      expect(dots).toHaveLength(4);
    });
  });

  describe("AI-103: Streaming state", () => {
    it("renders summary text with blinking cursor", () => {
      const { container } = render(
        <AISummaryPopup
          isOpen={true}
          summary="Partial summary"
          isLoading={true}
          error={null}
          onClose={() => {}}
          onRetry={() => {}}
        />,
      );

      expect(screen.getByText("Partial summary")).toBeTruthy();

      const cursor = container.querySelector(".animate-pulse");
      expect(cursor).toBeTruthy();
    });
  });

  describe("AI-104: Completed summary", () => {
    it("renders full summary without cursor", () => {
      const { container } = render(
        <AISummaryPopup
          isOpen={true}
          summary="Complete summary"
          isLoading={false}
          error={null}
          onClose={() => {}}
          onRetry={() => {}}
        />,
      );

      expect(screen.getByText("Complete summary")).toBeTruthy();

      const cursor = container.querySelector(".animate-pulse");
      expect(cursor).toBeFalsy();
    });
  });

  describe("AI-105: Error states", () => {
    it("renders generic error with retry button", () => {
      const onRetry = vi.fn();
      render(
        <AISummaryPopup
          isOpen={true}
          summary=""
          isLoading={false}
          error="เกิดข้อผิดพลาดในการเชื่อมต่อ"
          onClose={() => {}}
          onRetry={onRetry}
        />,
      );

      expect(
        screen.getByText("เกิดข้อผิดพลาดในการเชื่อมต่อ"),
      ).toBeTruthy();
      expect(screen.getByText("ลองใหม่อีกครั้ง (Retry)")).toBeTruthy();

      fireEvent.click(screen.getByText("ลองใหม่อีกครั้ง (Retry)"));
      expect(onRetry).toHaveBeenCalled();
    });

    it("renders quota error without retry button", () => {
      render(
        <AISummaryPopup
          isOpen={true}
          summary=""
          isLoading={false}
          error="โควต้า API หมด"
          onClose={() => {}}
          onRetry={() => {}}
        />,
      );

      expect(screen.getByText("โควต้า API หมด")).toBeTruthy();
      expect(
        screen.queryByText("ลองใหม่อีกครั้ง (Retry)"),
      ).toBeNull();
    });
  });

  describe("AI-106: Markdown rendering", () => {
    it("renders bold text with strong tag", () => {
      const { container } = render(
        <AISummaryPopup
          isOpen={true}
          summary="This is **bold** text"
          isLoading={false}
          error={null}
          onClose={() => {}}
          onRetry={() => {}}
        />,
      );

      const strong = container.querySelector("strong");
      expect(strong).toBeTruthy();
      expect(strong?.textContent).toBe("bold");
    });

    it("renders bullet lists", () => {
      const { container } = render(
        <AISummaryPopup
          isOpen={true}
          summary={"- Item 1\n- Item 2\n- Item 3"}
          isLoading={false}
          error={null}
          onClose={() => {}}
          onRetry={() => {}}
        />,
      );

      const items = container.querySelectorAll("li");
      expect(items).toHaveLength(3);
      expect(items[0]?.textContent).toContain("Item 1");
      expect(items[1]?.textContent).toContain("Item 2");
      expect(items[2]?.textContent).toContain("Item 3");
    });
  });

  describe("AI-107: Interaction", () => {
    it("fires onClose when close button is clicked", () => {
      const onClose = vi.fn();
      render(
        <AISummaryPopup
          isOpen={true}
          summary="Test"
          isLoading={false}
          error={null}
          onClose={onClose}
          onRetry={() => {}}
        />,
      );

      const closeButton = screen.getByLabelText("Close");
      fireEvent.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AISummaryPopup } from "@/app/posts/components/AISummaryPopup";

describe("AISummaryPopup", () => {
  const defaultProps = {
    isOpen: false,
    summary: "",
    isLoading: false,
    error: null,
    onClose: vi.fn(),
    onRetry: vi.fn(),
  };

  it("AP-001: renders nothing when isOpen is false", () => {
    const { container } = render(<AISummaryPopup {...defaultProps} />);
    expect(container.innerHTML).toBe("");
  });

  it("AP-002: shows loading state with first animated step when isLoading", () => {
    render(<AISummaryPopup {...defaultProps} isOpen={true} isLoading={true} />);
    expect(screen.getByText("กำลังอ่านเนื้อหา...")).toBeTruthy();
  });

  it("AP-003: shows error message and retry button when error is set", () => {
    const onRetry = vi.fn();
    render(
      <AISummaryPopup
        {...defaultProps}
        isOpen={true}
        error="เกิดข้อผิดพลาดในการเชื่อมต่อ"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByText("เกิดข้อผิดพลาดในการเชื่อมต่อ")).toBeTruthy();
    const retryButton = screen.getByText("ลองใหม่อีกครั้ง (Retry)");
    expect(retryButton).toBeTruthy();
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("AP-004: displays summary text when provided", () => {
    render(
      <AISummaryPopup
        {...defaultProps}
        isOpen={true}
        summary="This is a test summary"
      />,
    );
    expect(screen.getByText("This is a test summary")).toBeTruthy();
  });

  it("AP-005: renders bold markdown in summary", () => {
    render(
      <AISummaryPopup
        {...defaultProps}
        isOpen={true}
        summary="**bold text** normal text"
      />,
    );
    expect(screen.getByText("bold text")).toBeTruthy();
    expect(screen.getByText("bold text").tagName).toBe("STRONG");
    expect(screen.getByText("normal text")).toBeTruthy();
  });

  it("AP-006: calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <AISummaryPopup
        {...defaultProps}
        isOpen={true}
        summary="test"
        onClose={onClose}
      />,
    );
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

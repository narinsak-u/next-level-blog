import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMantineColorScheme } from "@mantine/core";
import { useTheme } from "@/hooks/useTheme";

const toggleColorScheme = vi.fn();
const setColorScheme = vi.fn();

beforeEach(() => {
  toggleColorScheme.mockClear();
  setColorScheme.mockClear();
  vi.mocked(useMantineColorScheme).mockReturnValue({
    colorScheme: "light",
    toggleColorScheme,
    setColorScheme,
  } as never);
});

describe("useTheme", () => {
  it("TH-001: returns isDark=true when colorScheme is dark", () => {
    vi.mocked(useMantineColorScheme).mockReturnValueOnce({
      colorScheme: "dark",
      toggleColorScheme,
      setColorScheme,
    } as never);

    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(true);
    expect(result.current.isLight).toBe(false);
  });

  it("TH-002: returns isLight=true when colorScheme is light", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);
  });

  it("TH-003: toggle calls toggleColorScheme", () => {
    const { result } = renderHook(() => useTheme());
    result.current.toggle();
    expect(toggleColorScheme).toHaveBeenCalled();
  });

  it("TH-004: setDark calls setColorScheme with 'dark'", () => {
    const { result } = renderHook(() => useTheme());
    result.current.setDark();
    expect(setColorScheme).toHaveBeenCalledWith("dark");
  });

  it("TH-005: setLight calls setColorScheme with 'light'", () => {
    const { result } = renderHook(() => useTheme());
    result.current.setLight();
    expect(setColorScheme).toHaveBeenCalledWith("light");
  });

  it("TH-006: setAuto calls setColorScheme with 'auto'", () => {
    const { result } = renderHook(() => useTheme());
    result.current.setAuto();
    expect(setColorScheme).toHaveBeenCalledWith("auto");
  });

  it("TH-007: returns isAuto=true when colorScheme is auto", () => {
    vi.mocked(useMantineColorScheme).mockReturnValueOnce({
      colorScheme: "auto",
      toggleColorScheme,
      setColorScheme,
    } as never);

    const { result } = renderHook(() => useTheme());
    expect(result.current.isAuto).toBe(true);
  });
});

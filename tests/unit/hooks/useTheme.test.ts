import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme } from '@/hooks/useTheme';

const mockToggleColorScheme = vi.fn();
const mockSetColorScheme = vi.fn();

vi.mock('@mantine/core', () => ({
  useMantineColorScheme: () => ({
    colorScheme: 'light',
    toggleColorScheme: mockToggleColorScheme,
    setColorScheme: mockSetColorScheme,
  }),
}));

describe('useTheme', () => {
  describe('isDark', () => {
    it('TH-001: returns true when colorScheme is dark', () => {
      vi.mock('@mantine/core', () => ({
        useMantineColorScheme: () => ({
          colorScheme: 'dark',
          toggleColorScheme: mockToggleColorScheme,
          setColorScheme: mockSetColorScheme,
        }),
      }));

      const { result } = renderHook(() => useTheme());
      expect(result.current.isDark).toBe(true);
      expect(result.current.isLight).toBe(false);
    });
  });

  describe('isLight', () => {
    it('TH-002: returns true when colorScheme is light', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.isLight).toBe(true);
      expect(result.current.isDark).toBe(false);
    });
  });

  describe('toggle()', () => {
    it('TH-003: calls toggleColorScheme', () => {
      const { result } = renderHook(() => useTheme());
      result.current.toggle();
      expect(mockToggleColorScheme).toHaveBeenCalled();
    });
  });

  describe('setDark()', () => {
    it('TH-004: sets dark mode', () => {
      const { result } = renderHook(() => useTheme());
      result.current.setDark();
      expect(mockSetColorScheme).toHaveBeenCalledWith('dark');
    });
  });

  describe('setLight()', () => {
    it('TH-005: sets light mode', () => {
      const { result } = renderHook(() => useTheme());
      result.current.setLight();
      expect(mockSetColorScheme).toHaveBeenCalledWith('light');
    });
  });

  describe('isAuto', () => {
    it('TH-002: returns true when colorScheme is auto', () => {
      vi.mock('@mantine/core', () => ({
        useMantineColorScheme: () => ({
          colorScheme: 'auto',
          toggleColorScheme: mockToggleColorScheme,
          setColorScheme: mockSetColorScheme,
        }),
      }));

      const { result } = renderHook(() => useTheme());
      expect(result.current.isAuto).toBe(true);
    });
  });
});

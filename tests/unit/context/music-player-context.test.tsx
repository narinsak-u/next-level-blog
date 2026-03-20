import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  MusicPlayerProvider,
  useMusicPlayer,
} from '@/context/MusicPlayerContext';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MusicPlayerProvider>{children}</MusicPlayerProvider>
);

describe('MusicPlayerContext', () => {
  describe('Initial State', () => {
    it('MP-001: isPlaying defaults to false', () => {
      const { result } = renderHook(() => useMusicPlayer(), { wrapper: TestWrapper });
      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('togglePlay()', () => {
    it('MP-002: toggles play state to true', async () => {
      const { result } = renderHook(() => useMusicPlayer(), { wrapper: TestWrapper });
      
      result.current.togglePlay();
      
      expect(result.current.isPlaying).toBe(true);
    });

    it('MP-003: toggles play state to false when already playing', async () => {
      const { result } = renderHook(() => useMusicPlayer(), { wrapper: TestWrapper });
      
      result.current.togglePlay();
      result.current.togglePlay();
      
      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('play()', () => {
    it('MP-004: directly plays audio', () => {
      const { result } = renderHook(() => useMusicPlayer(), { wrapper: TestWrapper });
      
      result.current.play();
      
      expect(result.current.isPlaying).toBe(true);
    });
  });

  describe('pause()', () => {
    it('MP-005: directly pauses audio', () => {
      const { result } = renderHook(() => useMusicPlayer(), { wrapper: TestWrapper });
      
      result.current.play();
      result.current.pause();
      
      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('setVolume()', () => {
    it('MP-006: updates volume', () => {
      const { result } = renderHook(() => useMusicPlayer(), { wrapper: TestWrapper });
      
      result.current.setVolume(0.5);
      
      expect(result.current.volume).toBe(0.5);
    });
  });

  describe('audioRef', () => {
    it('MP-001: provides audioRef', () => {
      const { result } = renderHook(() => useMusicPlayer(), { wrapper: TestWrapper });
      
      expect(result.current.audioRef).toBeDefined();
      expect(result.current.audioRef.current).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('MP-008: throws error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useMusicPlayer());
      }).toThrow('useMusicPlayer must be used within a MusicPlayerProvider');
      
      consoleError.mockRestore();
    });
  });
});

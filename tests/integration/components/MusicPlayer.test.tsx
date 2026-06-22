import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MusicPlayer } from '@/app/(home)/components/MusicPlayer';
import { MusicPlayerProvider } from '@/app/(home)/context/MusicPlayerContext';
import { MUSIC } from '@/lib/constants';

vi.mock('@/hooks/useMusicPlayer', () => ({
  useMusicPlayer: () => ({
    audioRef: { current: null },
    isPlaying: false,
    togglePlay: vi.fn(),
  }),
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<MusicPlayerProvider>{ui}</MusicPlayerProvider>);
};

describe('MusicPlayer', () => {
  describe('MP-001: Shows play icon initially', () => {
    it('renders play icon when not playing', () => {
      renderWithProvider(<MusicPlayer />);
      expect(screen.getByLabelText(/play music/i)).toBeTruthy();
    });
  });

  describe('MP-002: Click toggles to pause icon', () => {
    it('calls togglePlay when clicked', async () => {
      const togglePlay = vi.fn();
      vi.doMock('@/app/(home)/context/MusicPlayerContext', () => ({
        useMusicPlayer: () => ({
          audioRef: { current: null },
          isPlaying: false,
          togglePlay,
        }),
      }));

      renderWithProvider(<MusicPlayer />);
      const button = screen.getByLabelText(/play music/i);
      fireEvent.click(button);

      expect(togglePlay).toHaveBeenCalled();
    });
  });

  describe('MP-003: aria-label updates correctly', () => {
    it('shows pause label when playing', () => {
      vi.doMock('@/app/(home)/context/MusicPlayerContext', () => ({
        useMusicPlayer: () => ({
          audioRef: { current: null },
          isPlaying: true,
          togglePlay: vi.fn(),
        }),
      }));

      renderWithProvider(<MusicPlayer />);
      expect(screen.getByLabelText(/pause music/i)).toBeTruthy();
    });
  });

  describe('MP-004: Audio element configuration', () => {
    it('audio element has correct src', () => {
      renderWithProvider(<MusicPlayer />);
      const audio = document.querySelector('audio');
      expect(audio).toBeTruthy();
      expect(audio?.getAttribute('src')).toBe(MUSIC.SRC);
    });

    it('audio has loop attribute', () => {
      renderWithProvider(<MusicPlayer />);
      const audio = document.querySelector('audio');
      expect(audio?.hasAttribute('loop')).toBe(true);
    });
  });
});

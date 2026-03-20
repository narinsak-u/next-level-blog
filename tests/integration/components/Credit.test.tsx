import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Credit from '@/components/home/Credit';

vi.mock('@/components/home/MusicPlayer', () => ({
  default: () => <button data-testid="music-player">Music</button>,
}));

describe('Credit', () => {
  describe('CR-001: Renders credit link when configured', () => {
    it('renders credit link with Copyright icon', () => {
      render(<Credit />);
      const creditLink = screen.getByLabelText(/visit image source/i);
      expect(creditLink).toBeTruthy();
      expect(creditLink.getAttribute('href')).toBe(
        'https://moewwalls.com/anime/silhouette-at-twilight-sparkle-live-wallpaper/'
      );
    });
  });

  describe('CR-002: Credit handling', () => {
    it('credit element has correct structure', () => {
      render(<Credit />);
      const creditLink = screen.getByLabelText(/visit image source/i);
      expect(creditLink).toHaveAttribute('target', '_blank');
      expect(creditLink).toHaveAttribute('rel', 'noopener');
    });
  });

  describe('CR-003: External link attributes', () => {
    it('has rel="noopener" for security', () => {
      render(<Credit />);
      const creditLink = screen.getByLabelText(/visit image source/i);
      expect(creditLink.getAttribute('rel')).toContain('noopener');
    });
  });

  describe('CR-004: MusicPlayer rendered', () => {
    it('renders music player component', () => {
      render(<Credit />);
      expect(screen.getByTestId('music-player')).toBeTruthy();
    });
  });

  describe('Layout structure', () => {
    it('has correct positioning classes', () => {
      const { container } = render(<Credit />);
      const wrapper = container.firstChild;
      expect(wrapper?.firstChild).toHaveClass('fixed');
      expect(wrapper?.firstChild).toHaveClass('top-0');
      expect(wrapper?.firstChild).toHaveClass('left-0');
      expect(wrapper?.firstChild).toHaveClass('z-30');
    });
  });
});

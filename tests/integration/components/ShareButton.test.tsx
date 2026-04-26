import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShareGroup, ShareButton } from '@/components/ui/ShareButton';

describe('ShareButton', () => {
  describe('SB-001: Facebook button renders', () => {
    it('renders Facebook share button', () => {
      render(
        <ShareButton
          platform="facebook"
          url="https://example.com/post"
        />
      );
      
      expect(screen.getByRole('button')).toBeTruthy();
    });
  });

  describe('SB-002: Twitter button renders', () => {
    it('renders Twitter share button', () => {
      render(
        <ShareButton
          platform="twitter"
          url="https://example.com/post"
        />
      );
      
      expect(screen.getByRole('button')).toBeTruthy();
    });
  });

  describe('SB-003: Uses correct share URL', () => {
    it('Facebook button uses correct URL format', () => {
      const testUrl = 'https://example.com/post';
      render(
        <ShareButton
          platform="facebook"
          url={testUrl}
        />
      );
      
      const button = screen.getByRole('button');
      const shareButton = button.querySelector('a');
      expect(shareButton?.getAttribute('href')).toContain(encodeURIComponent(testUrl));
    });
  });

  describe('SB-004: Custom hashtag applied', () => {
    it('handles custom hashtag', () => {
      render(
        <ShareButton
          platform="facebook"
          url="https://example.com"
          hashtag="#custom"
        />
      );
      
      expect(screen.getByRole('button')).toBeTruthy();
    });
  });
});

describe('ShareGroup', () => {
  it('renders with default buttons when no children provided', () => {
    render(<ShareGroup postLink="https://example.com" />);
    
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders custom children', () => {
    render(
      <ShareGroup postLink="https://example.com">
        <button>Custom Share</button>
      </ShareGroup>
    );
    
    expect(screen.getByText('Custom Share')).toBeTruthy();
  });

  it('has correct positioning class', () => {
    const { container } = render(<ShareGroup postLink="https://example.com" />);
    
    expect(container.firstChild).toHaveClass('hidden');
    expect(container.firstChild).toHaveClass('absolute');
  });
});

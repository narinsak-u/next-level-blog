import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShareGroup, ShareButton } from '@/app/posts/components/ShareButton';

describe('ShareButton', () => {
  it('SB-001: renders Facebook share button', () => {
    render(
      <ShareButton
        platform="facebook"
        url="https://example.com/post"
      />
    );

    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('SB-002: renders Twitter share button', () => {
    render(
      <ShareButton
        platform="twitter"
        url="https://example.com/post"
      />
    );

    expect(screen.getByRole('button')).toBeTruthy();
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
});

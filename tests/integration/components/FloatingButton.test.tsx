import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingButton, FloatingButtonGroup } from '@/components/ui/FloatingButton';

const mockScrollTo = vi.fn();
window.scrollTo = mockScrollTo;

describe('FloatingButton', () => {
  describe('FB-001: Renders icon correctly', () => {
    it('renders icon component', () => {
      const MockIcon = () => <span>Icon</span>;
      render(
        <FloatingButton
          icon={MockIcon}
          label="Test Button"
          onClick={() => {}}
        />
      );
      expect(screen.getByText('Icon')).toBeTruthy();
    });
  });

  describe('FB-002: Click calls onClick', () => {
    it('invokes callback when clicked', () => {
      const onClick = vi.fn();
      const MockIcon = () => <span>Icon</span>;
      
      render(
        <FloatingButton
          icon={MockIcon}
          label="Test Button"
          onClick={onClick}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('FB-003: href creates link', () => {
    it('renders as anchor when href provided', () => {
      const MockIcon = () => <span>Icon</span>;
      
      render(
        <FloatingButton
          icon={MockIcon}
          label="Link Button"
          href="/posts"
        />
      );
      
      const link = screen.getByRole('link');
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/posts');
    });
  });

  describe('FB-004: external adds target="_blank"', () => {
    it('opens in new tab when external is true', () => {
      const MockIcon = () => <span>Icon</span>;
      
      render(
        <FloatingButton
          icon={MockIcon}
          label="External Link"
          href="https://example.com"
          external
        />
      );
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('FB-005: aria-label set correctly', () => {
    it('has accessible label', () => {
      const MockIcon = () => <span>Icon</span>;
      
      render(
        <FloatingButton
          icon={MockIcon}
          label="Scroll to top"
          onClick={() => {}}
        />
      );
      
      expect(screen.getByLabelText('Scroll to top')).toBeTruthy();
    });
  });
});

describe('FloatingButtonGroup', () => {
  it('renders children buttons', () => {
    const MockIcon = () => <span>Icon</span>;
    
    render(
      <FloatingButtonGroup>
        <FloatingButtonGroup.Button icon={MockIcon} label="Button 1" onClick={() => {}} />
        <FloatingButtonGroup.Button icon={MockIcon} label="Button 2" onClick={() => {}} />
      </FloatingButtonGroup>
    );
    
    expect(screen.getByLabelText('Button 1')).toBeTruthy();
    expect(screen.getByLabelText('Button 2')).toBeTruthy();
  });

  it('has correct positioning class', () => {
    const { container } = render(
      <FloatingButtonGroup className="custom-class">
        <span>Content</span>
      </FloatingButtonGroup>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('hidden');
    expect(container.firstChild).toHaveClass('md:flex');
  });
});

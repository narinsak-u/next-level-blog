import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  ManifestoPanel,
  ManifestoTrigger,
  ManifestoContent,
  ManifestoCloseButton,
  useManifesto,
} from '@/app/(home)/components/ManifestoPanel';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ManifestoPanel>{children}</ManifestoPanel>
);

describe('ManifestoPanel', () => {
  describe('MP-001: Trigger opens panel', () => {
    it('trigger button is rendered', () => {
      render(
        <TestWrapper>
          <ManifestoTrigger>Manifesto</ManifestoTrigger>
        </TestWrapper>
      );
      
      expect(screen.getByText('Manifesto')).toBeTruthy();
    });

    it('clicking trigger toggles panel', async () => {
      render(
        <TestWrapper>
          <ManifestoTrigger>Manifesto</ManifestoTrigger>
          <ManifestoContent>Content here</ManifestoContent>
        </TestWrapper>
      );
      
      const trigger = screen.getByText('Manifesto');
      await act(async () => {
        fireEvent.click(trigger);
      });
    });
  });

  describe('MP-002: Close button hides panel', () => {
    it('close button is rendered inside content', async () => {
      render(
        <TestWrapper>
          <ManifestoTrigger>Manifesto</ManifestoTrigger>
          <ManifestoContent>
            <ManifestoPanel.CloseButton />
          </ManifestoContent>
        </TestWrapper>
      );
      
      const trigger = screen.getByText('Manifesto');
      await act(async () => {
        fireEvent.click(trigger);
      });
      
      expect(screen.getByLabelText('Close manifesto')).toBeTruthy();
    });
  });

  describe('MP-003: ESC key closes panel', () => {
    it('escape key closes the panel', async () => {
      render(
        <TestWrapper>
          <ManifestoTrigger>Manifesto</ManifestoTrigger>
          <ManifestoContent>Press ESC to close</ManifestoContent>
        </TestWrapper>
      );
      
      const trigger = screen.getByText('Manifesto');
      await act(async () => {
        fireEvent.click(trigger);
      });
      
      await act(async () => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });
    });
  });

  describe('MP-004: Error handling', () => {
    it('useManifesto throws outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const BadComponent = () => {
        useManifesto();
        return null;
      };
      
      expect(() => {
        render(<BadComponent />);
      }).toThrow('useManifesto must be used within ManifestoPanel');
      
      consoleError.mockRestore();
    });
  });

  describe('MP-005: useManifesto hook works', () => {
    it('provides correct state through hook', () => {
      const TestComponent = () => {
        const { isOpen, open, close, toggle } = useManifesto();
        return (
          <div>
            <span data-testid="isOpen">{String(isOpen)}</span>
            <button onClick={open}>Open</button>
            <button onClick={close}>Close</button>
            <button onClick={toggle}>Toggle</button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('isOpen').textContent).toBe('false');
    });
  });
});

describe('ManifestoPanel compound components', () => {
  it('Trigger is accessible as static property', () => {
    expect(ManifestoPanel.Trigger).toBe(ManifestoTrigger);
  });

  it('Content is accessible as static property', () => {
    expect(ManifestoPanel.Content).toBe(ManifestoContent);
  });

  it('CloseButton is accessible as static property', () => {
    expect(ManifestoPanel.CloseButton).toBe(ManifestoCloseButton);
  });
});

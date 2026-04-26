import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContentTitle from '@/components/contents/ContentTitle';
import { mockPost } from '../../fixtures/posts';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('notFound called');
  }),
}));

describe('ContentTitle', () => {
  describe('CT-001: Renders title correctly', () => {
    it('displays post title', () => {
      render(<ContentTitle postData={mockPost} />);
      expect(screen.getByText('Test Post')).toBeTruthy();
    });
  });

  describe('CT-002: Renders formatted date', () => {
    it('shows last updated date when available', () => {
      render(<ContentTitle postData={mockPost} />);
      expect(screen.getByText(/last updated/i)).toBeTruthy();
    });

    it('displays date in readable format', () => {
      render(<ContentTitle postData={mockPost} />);
      expect(screen.getByText(/january|jan/i)).toBeTruthy();
    });
  });

  describe('CT-003: Shows lastUpdated date', () => {
    it('uses lastUpdated when present', () => {
      const postWithLastUpdated = {
        ...mockPost,
        lastUpdated: '2024-01-20T15:30:00.000Z',
      };
      
      render(<ContentTitle postData={postWithLastUpdated} />);
      expect(screen.getByText(/january/i)).toBeTruthy();
    });
  });

  describe('CT-004: Falls back to createdTime', () => {
    it('uses createdTime when lastUpdated is missing', () => {
      const postWithoutLastUpdated = {
        ...mockPost,
        lastUpdated: undefined,
        createdTime: '2024-01-15T10:00:00.000Z',
      };
      
      render(<ContentTitle postData={postWithoutLastUpdated} />);
      expect(screen.getByText(/january/i)).toBeTruthy();
    });
  });

  describe('CT-005: Renders tags', () => {
    it('displays tag items', () => {
      render(<ContentTitle postData={mockPost} />);
      expect(screen.getByText('React')).toBeTruthy();
      expect(screen.getByText('TypeScript')).toBeTruthy();
    });
  });

  describe('CT-006: Handles missing postData', () => {
    it('calls notFound when postData is null', () => {
      expect(() => {
        render(<ContentTitle postData={null as never} />);
      }).toThrow('notFound called');
    });

    it('calls notFound when postData is undefined', () => {
      expect(() => {
        render(<ContentTitle postData={undefined as never} />);
      }).toThrow('notFound called');
    });
  });
});

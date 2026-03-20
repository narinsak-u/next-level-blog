import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { postMapping } from '@/helpers/post-mapping';
import {
  validNotionPage,
  notionPageWithMissingFields,
  notionPageWithNullDates,
} from '../../fixtures/notion-response';

vi.mock('@/site/data', () => ({
  defaultImage: '/default-cover.jpg',
}));

describe('postMapping', () => {
  describe('PM-001: Valid Notion response maps correctly', () => {
    it('returns PageDataSchemaType with all fields', () => {
      const result = postMapping([validNotionPage as never]);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('uuid-123');
      expect(result[0].title).toBe('Test Post');
      expect(result[0].description).toBe('Test description');
      expect(result[0].category).toBe('Tech');
      expect(result[0].tags).toHaveLength(1);
      expect(result[0].tags[0].name).toBe('React');
    });
  });

  describe('PM-002: Empty array handling', () => {
    it('returns empty array when input is empty', () => {
      const result = postMapping([]);
      expect(result).toEqual([]);
    });
  });

  describe('PM-003: Missing optional fields use defaults', () => {
    it('uses default coverImage when cover is null', () => {
      const result = postMapping([notionPageWithMissingFields as never]);

      expect(result).toHaveLength(1);
      expect(result[0].coverImage).toBe('/default-cover.jpg');
    });

    it('uses default description when rich_text is empty', () => {
      const result = postMapping([notionPageWithMissingFields as never]);

      expect(result[0].description).toBeTruthy();
    });
  });

  describe('PM-004: Invalid data handling', () => {
    it('logs error and returns empty array on invalid data', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const invalidData = [{ invalid: 'data' }] as never;

      const result = postMapping(invalidData);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual([]);
      consoleSpy.mockRestore();
    });
  });

  describe('PM-005: Null title uses fallback', () => {
    it('defaults to "title" when title array is empty', () => {
      const result = postMapping([notionPageWithMissingFields as never]);

      expect(result[0].title).toBe('title');
    });

    it('defaults to "title" when title property is undefined', () => {
      const pageWithoutTitle = {
        ...validNotionPage,
        properties: {
          ...validNotionPage.properties,
          Name: undefined,
        },
      } as never;

      const result = postMapping([pageWithoutTitle]);
      expect(result[0].title).toBe('title');
    });
  });

  describe('PM-006: Multi-select tags parsed correctly', () => {
    it('returns array of tag objects', () => {
      const result = postMapping([validNotionPage as never]);

      expect(result[0].tags).toHaveLength(1);
      expect(result[0].tags[0]).toEqual({
        id: '1',
        name: 'React',
        color: 'blue',
      });
    });

    it('returns empty array when no tags', () => {
      const result = postMapping([notionPageWithMissingFields as never]);

      expect(result[0].tags).toEqual([]);
    });
  });

  describe('PM-007: Date fields handle null', () => {
    it('uses DEFAULT_DATE fallback when created_time is null', () => {
      const result = postMapping([notionPageWithNullDates as never]);

      expect(result[0].createdTime).toBeTruthy();
      expect(result[0].lastUpdated).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles page without properties', () => {
      const pageWithoutProps = {
        id: 'test-id',
        created_time: '2024-01-01',
        last_edited_time: '2024-01-02',
      } as never;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = postMapping([pageWithoutProps]);

      expect(result).toEqual([]);
      consoleSpy.mockRestore();
    });

    it('handles multiple pages', () => {
      const pages = [validNotionPage, notionPageWithMissingFields] as never[];
      const result = postMapping(pages);

      expect(result).toHaveLength(2);
    });
  });
});

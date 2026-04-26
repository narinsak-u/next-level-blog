import { describe, it, expect } from 'vitest';
import { cn, getFileExtension, isVideo } from '@/lib/utils';

describe('cn()', () => {
  it('UT-001: merges class names correctly', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('UT-002: handles conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toBe('foo baz');
  });

  it('UT-002: handles undefined and null', () => {
    const result = cn('foo', undefined, null, 'bar');
    expect(result).toBe('foo bar');
  });
});

describe('getFileExtension()', () => {
  it('UT-003: extracts extension from filename', () => {
    expect(getFileExtension('video.mp4')).toBe('mp4');
  });

  it('UT-003: handles path with directories', () => {
    expect(getFileExtension('/path/to/video.webm')).toBe('webm');
  });

  it('UT-004: handles query strings', () => {
    expect(getFileExtension('video.mp4?token=123')).toBe('mp4');
  });

  it('UT-004: handles filenames with multiple dots', () => {
    expect(getFileExtension('video.backup.mp4')).toBe('mp4');
  });

  it('UT-003: returns empty string for no extension', () => {
    expect(getFileExtension('filename')).toBe('');
  });
});

describe('isVideo()', () => {
  it('UT-005: returns true for video extensions', () => {
    expect(isVideo('mp4')).toBe(true);
    expect(isVideo('webm')).toBe(true);
    expect(isVideo('ogg')).toBe(true);
    expect(isVideo('mov')).toBe(true);
    expect(isVideo('avi')).toBe(true);
    expect(isVideo('m4v')).toBe(true);
  });

  it('UT-006: returns false for image extensions', () => {
    expect(isVideo('jpg')).toBe(false);
    expect(isVideo('png')).toBe(false);
    expect(isVideo('gif')).toBe(false);
    expect(isVideo('svg')).toBe(false);
    expect(isVideo('webp')).toBe(false);
  });

  it('UT-007: handles uppercase extensions', () => {
    expect(isVideo('MP4')).toBe(true);
    expect(isVideo('WEBM')).toBe(true);
    expect(isVideo('JPG')).toBe(false);
  });

  it('UT-006: returns false for empty string', () => {
    expect(isVideo('')).toBe(false);
  });

  it('UT-006: returns false for unknown extensions', () => {
    expect(isVideo('unknown')).toBe(false);
    expect(isVideo('doc')).toBe(false);
  });
});

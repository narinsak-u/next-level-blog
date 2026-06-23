import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MediaBackground, VideoBackground, ImageBackground } from '@/components/ui/MediaBackground';

describe('VideoBackground', () => {
  describe('MB-001: Renders video with placeholder', () => {
    it('renders video element', () => {
      render(
        <VideoBackground
          src="/video.mp4"
          placeholder="/poster.jpg"
        />
      );
      
      const video = document.querySelector('video');
      expect(video).toBeTruthy();
      expect(video?.getAttribute('src')).toBe('/video.mp4');
    });

    it('uses poster attribute for placeholder', () => {
      render(
        <VideoBackground
          src="/video.mp4"
          placeholder="/poster.jpg"
        />
      );
      
      const video = document.querySelector('video');
      expect(video?.getAttribute('poster')).toBe('/poster.jpg');
    });
  });

  describe('MB-002: Video plays automatically', () => {
    it('video has autoplay attribute', () => {
      render(
        <VideoBackground
          src="/video.mp4"
        />
      );
      
      const video = document.querySelector('video');
      expect(video?.hasAttribute('autoplay')).toBe(true);
    });

    it('video is muted for autoplay', () => {
      render(
        <VideoBackground
          src="/video.mp4"
        />
      );
      
      const video = document.querySelector('video');
      expect(video?.muted).toBe(true);
    });
  });

  describe('MB-004: Handles missing placeholder', () => {
    it('omits poster when no placeholder provided', () => {
      render(
        <VideoBackground src="/video.mp4" />
      );
      
      const video = document.querySelector('video');
      expect(video?.getAttribute('poster')).toBeFalsy();
    });
  });
});

describe('ImageBackground', () => {
    it('renders image with correct src', () => {
      render(
        <ImageBackground
          src="/image.jpg"
          alt="Test image"
        />
      );
      
      const img = document.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toContain('image.jpg');
    });

  it('applies priority loading by default', () => {
    render(
      <ImageBackground src="/image.jpg" />
    );
    
    const img = document.querySelector('img');
    expect(img?.getAttribute('loading')).toBe('eager');
  });
});

describe('MediaBackground', () => {
  it('renders children', () => {
    render(
      <MediaBackground>
        <div>Child content</div>
      </MediaBackground>
    );
    
    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('applies base classes', () => {
    const { container } = render(
      <MediaBackground>
        <span>Content</span>
      </MediaBackground>
    );
    
    expect(container.firstChild).toHaveClass('absolute');
    expect(container.firstChild).toHaveClass('object-cover');
  });
});

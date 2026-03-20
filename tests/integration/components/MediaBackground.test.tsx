import { describe, it, expect, vi, beforeEach } from 'vitest';
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

    it('renders placeholder image', () => {
      render(
        <VideoBackground
          src="/video.mp4"
          placeholder="/poster.jpg"
        />
      );
      
      const img = document.querySelector('img');
      expect(img).toBeTruthy();
    });
  });

  describe('MB-002: Video plays automatically', () => {
    it('video has autoplay and muted attributes', () => {
      render(
        <VideoBackground
          src="/video.mp4"
        />
      );
      
      const video = document.querySelector('video');
      expect(video?.getAttribute('autoplay')).toBe('');
    });

    it('video is muted for autoplay', () => {
      render(
        <VideoBackground
          src="/video.mp4"
        />
      );
      
      const video = document.querySelector('video');
      expect(video?.getAttribute('muted')).toBe('');
    });
  });

  describe('MB-004: Handles missing placeholder', () => {
    it('does not render image when no placeholder', () => {
      const { container } = render(
        <VideoBackground src="/video.mp4" />
      );
      
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(0);
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
    expect(img?.getAttribute('src')).toBe('/image.jpg');
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

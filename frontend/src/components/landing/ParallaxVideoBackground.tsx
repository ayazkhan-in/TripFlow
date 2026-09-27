import React, { useEffect, useRef, useState } from 'react';

interface ParallaxVideoBackgroundProps {
  videoSrc: string;
  posterSrc?: string;
  speed?: number; // Parallax speed multiplier (default: 0.35)
  overlayClassName?: string;
  className?: string;
}

export const ParallaxVideoBackground: React.FC<ParallaxVideoBackgroundProps> = ({
  videoSrc,
  posterSrc,
  speed = 0.35,
  overlayClassName,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('translate3d(0, 0px, 0) scale(1.15)');
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container) return;

    let isVisible = true;

    // IntersectionObserver to only animate and decode video when in/near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (video) {
            if (entry.isIntersecting) {
              video.play().catch(() => {
                // Autoplay may be deferred until user interaction
              });
            } else {
              video.pause();
            }
          }
        });
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 }
    );

    observer.observe(container);

    const updateParallax = () => {
      if (!isVisible || !container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress from 0 (entering bottom of screen) to 1 (leaving top of screen)
      const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      
      // Calculate smooth vertical parallax translation and gentle scale
      const translateY = (progress - 0.5) * 140 * speed;
      const scale = 1.16 - Math.abs(progress - 0.5) * 0.08;

      setTransformStyle(`translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`);
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateParallax);

      // Scroll-reactive video playback speed: gently accelerate video while actively scrolling
      if (video && isVisible) {
        video.playbackRate = 1.25;
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          if (video) video.playbackRate = 1.0;
        }, 180);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial position calculation
    updateParallax();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      observer.disconnect();
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* Moving Video Element with 3D Parallax Transform */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        preload="auto"
        className="absolute -inset-y-16 -inset-x-0 w-full h-[calc(100%+8rem)] object-cover will-change-transform transition-transform duration-100 ease-out"
        style={{
          transform: transformStyle,
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Custom gradient overlays for contrast and luxury typography readability */}
      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`} />}
    </div>
  );
};

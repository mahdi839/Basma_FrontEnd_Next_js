'use client';
import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import Portal from '../../Portal';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const visibilityOffset = 540;
  const scrollDuration = 650;

  const getScrollState = () => {
    const documentElement = document.documentElement;
    const body = document.body;
    const scrollTop = Math.max(
      window.scrollY || 0,
      documentElement?.scrollTop || 0,
      body?.scrollTop || 0
    );
    const scrollHeight = Math.max(
      documentElement?.scrollHeight || 0,
      body?.scrollHeight || 0
    );
    const clientHeight = window.innerHeight || documentElement?.clientHeight || 0;

    return {
      scrollTop,
      canScroll: scrollHeight - clientHeight > 120,
    };
  };

  useEffect(() => {
    let animationFrameId = null;

    const updateVisibility = () => {
      if (animationFrameId) return;

      animationFrameId = window.requestAnimationFrame(() => {
        const { scrollTop, canScroll } = getScrollState();

        setIsVisible(canScroll && scrollTop > visibilityOffset);
        animationFrameId = null;
      });
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    document.addEventListener('scroll', updateVisibility, true);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
      document.removeEventListener('scroll', updateVisibility, true);

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handleScroll = () => {
    const startPosition = Math.max(
      window.scrollY || 0,
      document.documentElement?.scrollTop || 0,
      document.body?.scrollTop || 0
    );

    if (startPosition <= 0) return;

    const startTime = window.performance.now();
    const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);
      const nextPosition = startPosition * (1 - easeOutCubic(progress));

      window.scrollTo(0, nextPosition);
      document.documentElement.scrollTop = nextPosition;
      document.body.scrollTop = nextPosition;

      if (progress < 1) {
        window.requestAnimationFrame(animateScroll);
      }
    };

    window.requestAnimationFrame(animateScroll);
  };

  if (!isVisible) return null;

  return (
    <Portal>
      <button
        type="button"
        onClick={handleScroll}
        className="scrollToTop_btn"
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </Portal>
  );
}

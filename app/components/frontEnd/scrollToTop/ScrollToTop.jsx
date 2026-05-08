'use client';
import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import Portal from '../../Portal';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const visibilityOffset = 240;

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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    document.documentElement.scrollTo?.({
      top: 0,
      behavior: 'smooth',
    });

    document.body.scrollTo?.({
      top: 0,
      behavior: 'smooth',
    });
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

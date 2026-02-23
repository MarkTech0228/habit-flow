// src/hooks/useSwipeToDelete.ts
// NEW — Phase 1 swipe gesture hook
import { useRef, useState, useCallback } from 'react';

interface SwipeToDeleteOptions {
  onDelete:  () => void;
  threshold?: number;   // px to trigger delete, default 80
}

export const useSwipeToDelete = ({
  onDelete,
  threshold = 80,
}: SwipeToDeleteOptions) => {
  const startX    = useRef(0);
  const currentX  = useRef(0);

  const [offset,     setOffset]     = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current  = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    // Left-swipe only (negative offset), capped at -120 px
    if (diff < 0) setOffset(Math.max(diff, -120));
  }, [isDragging]);

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (offset < -threshold) {
      setIsDeleting(true);
      setOffset(-400);          // fly off screen
      setTimeout(() => {
        onDelete();
        setIsDeleting(false);
        setOffset(0);
      }, 300);
    } else {
      setOffset(0);             // snap back
    }
  }, [offset, threshold, onDelete]);

  const swipeStyle: React.CSSProperties = {
    transform:  `translateX(${offset}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease',
    position:   'relative',
  };

  /** 0 = hidden, 1 = fully visible delete background */
  const deleteReveal = Math.min(Math.abs(offset) / threshold, 1);

  return {
    swipeStyle,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isDeleting,
    deleteReveal,
  };
};
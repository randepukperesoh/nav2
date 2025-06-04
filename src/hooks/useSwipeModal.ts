import { useCallback, useState, type TouchEvent } from "react";

export const useSwipeModal = () => {
  const [startY, setStartY] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    setStartY(e.touches[0].clientY);
  }, []);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (startY === null) return;

      const currentY = e.touches[0].clientY;
      const diff = startY - currentY;

      if (diff > 50) {
        setIsOpen(true);
        setStartY(null);
      }
      if (diff < -50) {
        setIsOpen(false);
        setStartY(null);
      }
    },
    [startY]
  );

  const handleTouchEnd = useCallback(() => setStartY(null), []);

  return {
    isOpen,
    handleTouchEnd,
    handleTouchMove,
    toggleModal,
    handleTouchStart,
  };
};

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useRef, useEffect, useMemo } from "react";

const getFloorFromY = (y: number): number => {
  if (y >= -8 && y <= 2) return 0;
  if (y >= 4 && y <= 14) return 1;
  if (y >= 12 && y <= 22) return 2;
  if (y >= 20 && y <= 30) return 3;
  if (y >= 28 && y <= 38) return 4;
  if (y >= 35 && y <= 45) return 5;
  if (y >= 43 && y <= 53) return 6;
  if (y >= 51 && y <= 61) return 7;
  if (y >= 59 && y <= 69) return 8;
  return -1;
};

export const AnimatedLine = ({ 
  points,
  floorNumber
}: { 
  points: [number, number, number][];
  floorNumber: number;
}) => {
  const [displayedSegments, setDisplayedSegments] = useState<[number, number, number][][]>([]);
  const animationRef = useRef<number>(0);
  const lastFloorRef = useRef<number>(floorNumber);

  // Сбрасываем анимацию при смене этажа
  useEffect(() => {
    if (floorNumber !== lastFloorRef.current) {
      setDisplayedSegments([]);
      animationRef.current = 0;
      lastFloorRef.current = floorNumber;
    }
  }, [floorNumber]);

  // Разбиваем точки на сегменты
  const segments = useMemo(() => {
    if (!points || points.length === 0) return [];

    const result: [number, number, number][][] = [];
    let currentSegment: [number, number, number][] = [];
    let prevFloor = getFloorFromY(points[0][1]);

    points.forEach((point) => {
      const currentFloor = getFloorFromY(point[1]);
      
      // Разрыв сегмента при:
      // 1. Смене этажа
      const shouldBreak = currentFloor !== prevFloor

      if (shouldBreak && currentSegment.length > 0) {
        result.push(currentSegment);
        currentSegment = [];
      }

      if (currentFloor === floorNumber) {
        currentSegment.push(point);
      }
      prevFloor = currentFloor;
    });

    if (currentSegment.length > 0) {
      result.push(currentSegment);
    }

    return result;
  }, [points, floorNumber]);

  // Анимация
  useFrame((state) => {
    if (segments.length === 0 || segments.every(s => s.length === 0)) {
      setDisplayedSegments([]);
      return;
    }

    const t = state.clock.getElapsedTime();
    const duration = 3;
    const progress = Math.min(t / duration, 1);
    
    const totalPoints = segments.reduce((sum, seg) => sum + seg.length, 0);
    const pointsToShow = Math.floor(totalPoints * progress);

    let accumulated = 0;
    const newSegments: [number, number, number][][] = [];

    for (const segment of segments) {
      if (accumulated >= pointsToShow) break;

      const remaining = pointsToShow - accumulated;
      const showCount = Math.min(remaining, segment.length);
      newSegments.push(segment.slice(0, showCount));
      accumulated += segment.length;
    }

    setDisplayedSegments(newSegments);
  });

  // Собираем линии для рендера
  const lines = useMemo(() => {
    return displayedSegments.flatMap(segment => {
      const lines = [];
      for (let i = 1; i < segment.length; i++) {
        lines.push([segment[i-1], segment[i]]);
      }
      return lines;
    });
  }, [displayedSegments]);

  if (lines.length === 0) return null;

  return (
    <group>
      {lines.map(([start, end], index) => (
        <Line
          key={`line-${index}`}
          points={[start, end]}
          color="red"
          dashed
          dashSize={2}
          gapSize={2}
          lineWidth={6}
        />
      ))}
    </group>
  );
};
import { Line } from "@react-three/drei";
import { useFrame, type Vector3 } from "@react-three/fiber";
import { useState, useRef } from "react";

export const AnimatedLine = ({ points }: { points: Vector3[] }) => {
  const [pointsS, setPointsS] = useState<Vector3[]>([points[0]]);
  const ref = useRef<number>(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime(); // Возвращает время в секундах
    const duration = 3; // Длительность анимации (в секундах)
    const progress = Math.min(t / duration, 1); // Прогресс от 0 до 1

    const numPointsToShow = Math.floor(points.length * progress);
    if (ref.current !== numPointsToShow) {
      ref.current = numPointsToShow;
      setPointsS(points.slice(0, numPointsToShow));
    }
  });

  return (
    <Line
      points={pointsS}
      color="red"
      dashed
      dashSize={2}
      gapSize={2}
      lineWidth={6}
    />
  );
};

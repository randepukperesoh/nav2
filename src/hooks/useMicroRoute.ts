import { useEffect, useState } from "react";
import { useRouteStore } from "../components/store/store";
import type { Position } from "../types";
import { useFloorLoader } from "./useFloorLoader";

export type DirectionStep = {
  direction: string;
  distance: string | number;
  coordinates: Position;
  floor: number;
};

type MicroRouteResult = {
  step: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  directions: DirectionStep[];
  currentFloor: number;
};

export const getFloorFromY = (y: number): number => {
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

const calculateAngleAndDirection = (
  pointA: Position,
  pointB: Position,
  pointC: Position
) => {
  // Векторы AB и BC (только по осям X и Z)
  const vectorAB = [
    pointB[0] - pointA[0],
    0, // Игнорируем Y
    pointB[2] - pointA[2],
  ];
  const vectorBC = [
    pointC[0] - pointB[0],
    0, // Игнорируем Y
    pointC[2] - pointB[2],
  ];

  // Модули векторов
  const magnitudeAB = Math.sqrt(vectorAB[0] ** 2 + vectorAB[2] ** 2);
  const magnitudeBC = Math.sqrt(vectorBC[0] ** 2 + vectorBC[2] ** 2);

  // Скалярное произведение векторов
  const dotProduct = vectorAB[0] * vectorBC[0] + vectorAB[2] * vectorBC[2];

  // Косинус угла между векторами
  const cosAngle = dotProduct / (magnitudeAB * magnitudeBC);

  // Угол в радианах
  const angleRad = Math.acos(cosAngle);

  // Угол в градусах
  const angleDeg = angleRad * (180 / Math.PI);

  // Векторное произведение векторов AB и BC (только по осям X и Z)
  const crossProductXZ = vectorAB[0] * vectorBC[2] - vectorAB[2] * vectorBC[0];

  // Направление поворота определяется знаком z-компонента векторного произведения
  let direction = "прямо";
  if (crossProductXZ > 0) {
    direction = "влево";
  } else if (crossProductXZ < 0) {
    direction = "вправо";
  }

  return { angle: angleDeg, direction };
};

const calculateDistance = (pointA: Position, pointB: Position) => {
  return Math.sqrt(
    (pointB[0] - pointA[0]) ** 2 + (pointB[2] - pointA[2]) ** 2 // Игнорируем Y
  );
};

export const useMicroRoute = (): MicroRouteResult => {
  const [step, setStep] = useState(0);
  const { route, startId, endId } = useRouteStore();
  const { handleChangeFloor, floorNumber } = useFloorLoader();

  useEffect(() => {
    setStep(0); // Сброс шага при изменении маршрута
  }, [route]);

  if(!startId || !endId) {
    return {
      step: 0, 
      handleNextStep: () => {},
      handlePrevStep: () => {},
      directions: [],
      currentFloor: 0,
    } 
  }

  if (!Array.isArray(route) || route.length < 3) {
    return {
      step: 0,
      handleNextStep: () => {},
      handlePrevStep: () => {},
      directions: [],
      currentFloor: 0,
    };
  }

  const directions: DirectionStep[] = [];
  let currentFloor = getFloorFromY(route[0][1]);
  let lastDirectionPoint = route[0];

  // Добавляем начало маршрута
  directions.push({
    direction: "начало маршрута",
    distance: 0,
    coordinates: route[0],
    floor: currentFloor,
  });

  // Анализируем маршрут для поворотов и смены этажей
  for (let i = 1; i < route.length - 1; i++) {
    const { angle, direction } = calculateAngleAndDirection(
      route[i - 1],
      route[i],
      route[i + 1]
    );
    const pointFloor = getFloorFromY(route[i][1]);

    // Добавляем шаг только если это поворот (>30 градусов) или смена этажа
    if (angle > 30 || pointFloor !== currentFloor) {
      
      // Добавляем сам поворот/подъем
      directions.push({
        direction: pointFloor !== currentFloor ? "лестница" : direction,
        distance: 0,
        coordinates: route[i],
        floor: pointFloor,
      });

      currentFloor = pointFloor;
      lastDirectionPoint = route[i];
    }
  }

  // Добавляем последний отрезок до конца маршрута
  const finalDistance = calculateDistance(lastDirectionPoint, route[route.length - 1]);
  if (finalDistance > 0) {
    directions.push({
      direction: "прямо",
      distance: finalDistance.toFixed(2),
      coordinates: lastDirectionPoint,
      floor: currentFloor,
    });
  }

  // Добавляем конец маршрута
  directions.push({
    direction: "конец маршрута",
    distance: 0,
    coordinates: route[route.length - 1],
    floor: getFloorFromY(route[route.length - 1][1]),
  });

  const maxStep = directions.length - 1;

  const handleNextStep = () => {
    setStep(prev => {
      const newStep = Math.min(prev + 1, maxStep);
      const nextFloor = directions[newStep]?.floor;
      if (nextFloor !== undefined && nextFloor !== floorNumber) {
        handleChangeFloor(nextFloor);
      }
      return newStep;
    });
  };

  const handlePrevStep = () => {
    setStep(prev => {
      const newStep = Math.max(prev - 1, 0);
      const prevFloor = directions[newStep]?.floor;
      if (prevFloor !== undefined && prevFloor !== floorNumber) {
        handleChangeFloor(prevFloor);
      }
      return newStep;
    });
  };

  return {
    step,
    handleNextStep,
    handlePrevStep,
    directions,
    currentFloor: directions[step]?.floor ?? floorNumber,
  };
};
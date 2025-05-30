import { useState } from "react";
import { useRouteStore } from "../components/store/store";
import type { Position } from "../types";

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

export const useMicroRoute = () => {
  const [step, setStep] = useState(0);

  const { route } = useRouteStore();

  if (!Array.isArray(route) || route.length < 3) {
    return [];
  }

  const directions = [];
  let distanceToNextTurn = 0;
  let lastPoint = route[0]; 

  for (let i = 1; i < route.length - 1; i++) {
    const { angle, direction } = calculateAngleAndDirection(
      route[i - 1],
      route[i],
      route[i + 1]
    );
    const distanceSegment = calculateDistance(route[i - 1], route[i]);

    distanceToNextTurn += distanceSegment;

    if (angle > 30) {
      if (distanceToNextTurn > 0) {
        directions.push({
          direction: "прямо",
          distance: distanceToNextTurn.toFixed(2),
          coordinates: lastPoint, 
        });
      }
      directions.push({
        direction,
        distance: 0,
        coordinates: route[i], // Координаты точки поворота
      });
      distanceToNextTurn = 0;
      lastPoint = route[i + 1]; // Обновляем последнюю точку
    }
  }

  // Добавляем последнее движение "прямо" до конца маршрута
  if (distanceToNextTurn > 0) {
    directions.push({
      direction: "прямо",
      distance: distanceToNextTurn.toFixed(2),
      coordinates: lastPoint, // Координаты начала последнего прямого участка
    });
  }

  // Добавляем начало и конец маршрута
  directions.unshift({
    direction: "начало маршрута",
    distance: 0,
    coordinates: route[0], // Координаты начала маршрута
  });
  directions.push({
    direction: "конец маршрута",
    distance: 0,
    coordinates: route[route.length - 1], // Координаты конца маршрута
  });

  const maxLenght = directions.length - 1;

  const handleNextStep = () =>
    setStep((prev) => (prev === maxLenght ? prev : prev + 1));

  const handlePrevStep = () =>
    setStep((prev) => (prev === 0 ? prev : prev - 1));

  const res = { step, handleNextStep, handlePrevStep, directions }
  return res;
};
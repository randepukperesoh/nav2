import { useEffect, useState } from "react";
import { buildRoute, type Point } from "./i";
import campusData from "./assets/campusData.json";

export const useCreateRoute = () => {
  const [route, setRoute] = useState<Point[]>([]);

  const points = route.map(
    (point) => [point.x, 1, -point.y + 5] as [number, number, number]
  );

  useEffect(() => {
    const route = buildRoute(campusData, "101", "1-122");
    setRoute(route);
  }, []);

  return {
    route,
    points,
  };
};

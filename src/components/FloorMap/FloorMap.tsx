import { useFloorLoader } from "../../hooks/useFloorLoader";
import { useShortestPath } from "../../hooks/usePath";
import { useRouteStore } from "../store/store";
import { useGetPathFromParam } from "../../hooks/useGetPathFromParam";
import { useMicroRoute } from "../../hooks/useMicroRoute";
import { lazy, useEffect, useState } from "react";
import type { Position } from "../../types";
import { getFloorDefaultPosition } from "./helper";
import CustomCanvas from "./Canvas";

const RouteModal = lazy(() => import("../RouteModal/RouteModal"));
const FloorManipulator = lazy(
  () => import("../FloorManipulator/FloorManipulator")
);

const FloorMap = () => {
  const {
    arrFloors,
    floorNumber,
    handleChangeFloor,
    selectedFloor,
    isLoading,
  } = useFloorLoader();

  const { startId, endId } = useRouteStore();

  const { shortestPath: routes } = useShortestPath(startId, endId);

  useGetPathFromParam();

  const {
    step,
    handleNextStep,
    handlePrevStep,
    directions: microRoute,
  } = useMicroRoute();

  const [cameraPosition, setCameraPosition] = useState<Position>([
    0.5,
    70 + (floorNumber - 1) * 8,
    33.5,
  ]);
  const [cameraTarget, setCameraTarget] = useState<Position>([0.5, 0, 33.5]);

  useEffect(() => {
    if (microRoute && microRoute.length > 0 && microRoute[step]) {
      const newPosition = [
        microRoute[step].coordinates[0],
        60 + (floorNumber - 1) * 8, // Фиксированная высота камеры
        microRoute[step].coordinates[2],
      ] as Position;

      const newTarget = [
        microRoute[step].coordinates[0],
        0, // Фиксированная высота цели (уровень пола)
        microRoute[step].coordinates[2],
      ] as Position;

      setCameraPosition(newPosition);
      setCameraTarget(newTarget);
    } else {
      const newPosition = getFloorDefaultPosition(floorNumber);

      const newTarget = [newPosition[0], 0, newPosition[2]] as Position;

      setCameraPosition(newPosition);
      setCameraTarget(newTarget);
    }
  }, [step, floorNumber, startId, endId, routes]);

  return (
    <>
      <FloorManipulator
        selectedFloor={floorNumber}
        handleChangeFloor={handleChangeFloor}
        arrFloors={arrFloors}
      />

      <RouteModal
        step={step}
        handleNextStep={handleNextStep}
        handlePrevStep={handlePrevStep}
        microRoute={microRoute}
      />
      <CustomCanvas
        cameraPosition={cameraPosition}
        cameraTarget={cameraTarget}
        isLoading={isLoading}
        selectedFloor={selectedFloor}
        floorNumber={floorNumber}
        microRoute={microRoute}
        step={step}
        routes={routes}
      />
    </>
  );
};

export default FloorMap;

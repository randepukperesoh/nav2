import { Canvas } from "@react-three/fiber";
import { useFloorLoader } from "../../hooks/useFloorLoader";
import { FloorManipulator } from "../FloorManipulator/FloorManipulator";
import { Room, type IDot } from "../Room/Room";
import dots from "../../assets/names.json";
import { useShortestPath } from "../../hooks/usePath";
import { useRouteStore } from "../store/store";
import { AnimatedLine } from "../AnimtedLine/AnimatedLine";
import { RouteModal } from "../RouteModal/RouteModal";
import { useGetPathFromParam } from "../../hooks/useGetPathFromParam";
import { Camera } from "../Icons/Camera";
import { Plane } from "@react-three/drei";
import { MeshBasicMaterial } from "three";
import { useMicroRoute } from "../../hooks/useMicroRoute";
import { useEffect, useState } from "react";
import type { Position } from "../../types";

const FloorMap = () => {
  const { arrFloors, floorNumber, handleChangeFloor, selectedFloor } =
    useFloorLoader();

  const { startId, endId } = useRouteStore();

  const [openModalName, setOpenModalName] = useState<string | null>(null);

  const { shortestPath: routes } = useShortestPath(startId, endId);

  const [cameraPosition, setCameraPosition] = useState<Position>([
    0.5, 70, 33.5,
  ]);
  const [cameraTarget, setCameraTarget] = useState<Position>([0.5, 0, 33.5]);

  useGetPathFromParam();

  const {
    step,
    handleNextStep,
    handlePrevStep,
    directions: microRoute,
  } = useMicroRoute();

  const shinyMaterial = new MeshBasicMaterial({
    color: "#edeef0",
  });

  useEffect(() => {
    if (microRoute && microRoute.length > 0) {
      const newPosition = [
        microRoute[step].coordinates[0],
        70, // Фиксированная высота камеры
        microRoute[step].coordinates[2],
      ] as Position;

      const newTarget = [
        microRoute[step].coordinates[0],
        0, // Фиксированная высота цели (уровень пола)
        microRoute[step].coordinates[2],
      ] as Position;

      setCameraPosition(newPosition);
      setCameraTarget(newTarget);
    }
  }, [step]);

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
      <Canvas color="#fff" camera={{ fov: 90 }}>
        <primitive
          object={selectedFloor.scene}
          position={[floorNumber * 5, floorNumber * 5, floorNumber * 5]}
        />
        {dots.names[floorNumber].map((el, i) => {
          return (
            <Room
              key={el.name + "_" + i}
              openModalName={openModalName}
              setOpenModalName={setOpenModalName}
              room={el as IDot}
            />
          );
        })}

        {routes.length > 0 && (
          <AnimatedLine floorNumber={floorNumber} points={routes} />
        )}
        <Camera position={cameraPosition} target={cameraTarget} />
        <Plane
          position={[0, -10, -10]}
          material={shinyMaterial}
          args={[1000, 1000, 1000]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </Canvas>
    </>
  );
};

export default FloorMap;

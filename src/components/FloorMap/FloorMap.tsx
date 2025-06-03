import { Canvas, useLoader } from "@react-three/fiber";
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
import { Html, Plane } from "@react-three/drei";
import { useMicroRoute } from "../../hooks/useMicroRoute";
import { useEffect, useState } from "react";
import type { Position } from "../../types";
import * as THREE from "three"

export const getFloorDefaultPosition = (floor: number): Position => {
  switch (floor) {
    case 0:
      return [-10, 72, 0] as Position;
    case 1:
      return [0.5, 70, 33.5] as Position;
    case 2:
      return [5.5, 78, 38.5] as Position;
    case 3:
      return [10.5, 86, 43.5] as Position;
    case 4:
      return [15.5, 94, 48.5] as Position;
    case 5:
      return [20, 122, -30] as Position;
    case 6:
      return [25, 130, -25] as Position;
    case 7:
      return [90, 130, -50] as Position;
    case 8:
      return [100, 106, -20] as Position;
    default: 
      return [0, 70, 0] as Position;
  }
};

const FloorMap = () => {
  const {
    arrFloors,
    floorNumber,
    handleChangeFloor,
    selectedFloor,
    isLoading,
  } = useFloorLoader();

  const { startId, endId } = useRouteStore();

  const [openModalName, setOpenModalName] = useState<string | null>(null);

  const { shortestPath: routes } = useShortestPath(startId, endId);

  const [cameraPosition, setCameraPosition] = useState<Position>([
    0.5,
    70 + (floorNumber - 1) * 8,
    33.5,
  ]);
  const [cameraTarget, setCameraTarget] = useState<Position>([0.5, 0, 33.5]);

  useGetPathFromParam();

  const {
    step,
    handleNextStep,
    handlePrevStep,
    directions: microRoute,
  } = useMicroRoute();

  const travaTexture = useLoader(THREE.TextureLoader, "/texture_trava.jpg");

  travaTexture.wrapS = travaTexture.wrapT = THREE.RepeatWrapping;

  travaTexture.repeat.set(100, 100);
  travaTexture.offset.set(0, 0);
  travaTexture.anisotropy = 64;
  travaTexture.minFilter = THREE.LinearMipmapLinearFilter;
  travaTexture.magFilter = THREE.LinearFilter;

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

      const newTarget = [newPosition[0], 0, newPosition[2]] as Position

      setCameraPosition(newPosition);
      setCameraTarget(newTarget);
    }
    console.log(microRoute)
    console.log(step)
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
      <Canvas style={{ background: "#edeef0" }} camera={{ fov: 90 }}>
        
        {isLoading ? (
          <Html center>
            <span className="loader"></span>
          </Html>
        ) : (
          <>
            { selectedFloor ? <primitive
              object={selectedFloor.scene}
              position={[floorNumber * 5, floorNumber * 5, floorNumber * 5]}
            /> : <Html center><div>Ошибка загрузки модели этажа. Перезагрузите страницу</div></Html>}
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

            {routes.length > 0 && microRoute && microRoute.length > 0 && (
              <AnimatedLine floorNumber={floorNumber} points={routes} />
            )}
          </>
        )}
        <Camera position={cameraPosition} target={cameraTarget} floorNumber={microRoute && microRoute.length > 0 && microRoute[step] ? microRoute[step].floor : floorNumber}/>
          <Plane args={[1000, 1000]} position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial map={travaTexture} />
        </Plane>
      </Canvas>
    </>
  );
};

export default FloorMap;

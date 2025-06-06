import { Html, Plane } from "@react-three/drei";
import { Camera } from "../Icons/Camera";
import { AnimatedLine } from "../AnimtedLine/AnimatedLine";
import { Room, type IDot } from "../Room/Room";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState, type FC } from "react";
import type { Position } from "../../types";
import type { DirectionStep } from "../../hooks/useMicroRoute";
import { useGetPoints } from "../../hooks/useGetPoints";

interface ICustomCanvas {
  cameraPosition: Position;
  cameraTarget: Position;
  selectedFloor: any;
  environment: any;
  floorNumber: number;
  isLoading: boolean;
  microRoute: DirectionStep[];
  step: number;
  routes: Position[];
}

const CustomCanvas: FC<ICustomCanvas> = ({
  cameraPosition,
  cameraTarget,
  isLoading,
  selectedFloor,
  environment,
  floorNumber,
  microRoute,
  step,
  routes,
}) => {
  const [openModalName, setOpenModalName] = useState<string | null>(null);

  const { namedPoints: dots, loadPoints } = useGetPoints();

  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  return (
    <Canvas style={{ background: "#EAD27BFF" }} camera={{ fov: 90 }}>
      {isLoading ? (
        <Html center>
        </Html>
      ) : (
        <>
          {selectedFloor ? (
            <primitive
              object={selectedFloor.scene}
              position={[floorNumber * 5, floorNumber * 5, floorNumber * 5]}
            />
          ) : (
            <Html center>
              <div>Ошибка загрузки модели этажа. Перезагрузите страницу</div>
            </Html>
          )}
          {environment && floorNumber == 1 && <primitive object={environment.scene} position={[5, 3, 5]}/>}
          {dots?.names[floorNumber].map((el, i) => {
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
      <Camera
        position={cameraPosition}
        target={cameraTarget}
        floorNumber={
          microRoute && microRoute.length > 0 && microRoute[step]
            ? microRoute[step].floor
            : floorNumber
        }
      />
      <Plane
        args={[1000, 1000]}
        position={[0, -10, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        
      >
        <meshStandardMaterial color={"#EAD27B"} />
      </Plane>
    </Canvas>
  );
};

export default CustomCanvas;

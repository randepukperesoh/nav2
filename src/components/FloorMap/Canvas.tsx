import { Html, Plane } from "@react-three/drei";
import { Camera } from "../Icons/Camera";
import { AnimatedLine } from "../AnimtedLine/AnimatedLine";
import { Room, type IDot } from "../Room/Room";
import { Canvas } from "@react-three/fiber";
import useLoadTexture from "../../hooks/useLoadTexture";
import { useEffect, useState, type FC } from "react";
import type { Position } from "../../types";
import type { DirectionStep } from "../../hooks/useMicroRoute";
import { useGetPoints } from "../../hooks/useGetPoints";

interface ICustomCanvas {
  cameraPosition: Position;
  cameraTarget: Position;
  selectedFloor: any;
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
  floorNumber,
  microRoute,
  step,
  routes,
}) => {
  const [openModalName, setOpenModalName] = useState<string | null>(null);

  const { travaTexture } = useLoadTexture();

  const { namedPoints: dots, loadPoints } = useGetPoints();

  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  return (
    <Canvas style={{ background: "#edeef0" }} camera={{ fov: 90 }}>
      {isLoading ? (
        <Html center>
          <span className="loader"></span>
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
        <meshStandardMaterial map={travaTexture} />
      </Plane>
    </Canvas>
  );
};

export default CustomCanvas;

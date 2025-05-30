import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { Position } from "../../types";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export const Camera = ({
  position = [0, 0, 50],
  target = [0, 0, 0],
}: {
  position: Position;
  target: Position;
}) => {
  const { camera } = useThree();

  useEffect(() => {
    // camera.position.set(...position);
    // camera.lookAt(...target);
  }, [position, target, camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <PerspectiveCamera
        makeDefault
        // fov={75}
        near={0.1}
        far={1000}
      />
      <OrbitControls
        makeDefault
        enabled={true}
        minDistance={30}
        maxDistance={300}
        minPolarAngle={0}
        maxPolarAngle={0}
        minAzimuthAngle={0}
        maxAzimuthAngle={0}
        enableDamping={true}
        dampingFactor={0.25}
        enableZoom={true}
        zoomSpeed={1.2}
        enablePan={true}
        panSpeed={1.0}
        screenSpacePanning={true}
        keyPanSpeed={7.0}
        autoRotate={false}
        autoRotateSpeed={2.0}
        mouseButtons={{
          LEFT: 2,
          MIDDLE: 1,
          RIGHT: 0,
        }}
        touches={{
          ONE: 1,
          TWO: 2,
        }}
      />
    </>
  );
};

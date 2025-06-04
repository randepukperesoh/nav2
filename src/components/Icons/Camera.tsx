import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { Position } from "../../types";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRouteStore } from "../store/store";
import { getFloorDefaultPosition } from "../FloorMap/helper";

const SMOOTHNESS = 0.1;
const RETURN_DELAY = 4500;
const TRANSITION_TIME = 1500;

export const Camera = ({
  position = [0.5, 70, 33.5],
  target = [0.5, 0, 33.5],
  floorNumber,
}: {
  position: Position;
  target: Position;
  floorNumber: number;
}) => {
  const { camera } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const [userControlling, setUserControlling] = useState(false);
  const lastInteraction = useRef(Date.now());
  const animationRef = useRef<number>(undefined);
  const { setCurrentFloor, currentFloor } = useRouteStore();

  // Используем рефы вместо стейта для текущих целей
  const targetPosRef = useRef(new THREE.Vector3(...position));
  const targetLookAtRef = useRef(new THREE.Vector3(...target));
  const targetFloor = useRef(floorNumber);

  // Инициализация
  useEffect(() => {
    camera.position.copy(targetPosRef.current);
    camera.lookAt(targetLookAtRef.current);

    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(targetLookAtRef.current);
      controls.update();

      const onStart = () => {
        setUserControlling(true);
        lastInteraction.current = Date.now();
        cancelAnimation();
      };

      const onEnd = () => {
        lastInteraction.current = Date.now();
        setTimeout(checkAutoReturn, RETURN_DELAY);
      };

      controls.addEventListener("start", onStart);
      controls.addEventListener("end", onEnd);

      return () => {
        controls.removeEventListener("start", onStart);
        controls.removeEventListener("end", onEnd);
        cancelAnimation();
      };
    }
  }, []);

  useEffect(() => {
    const currentPosition = getFloorDefaultPosition(currentFloor);
    const currentTarget = [currentPosition[0], 0, currentPosition[2]];
    startAnimation(
      new THREE.Vector3(...currentPosition),
      new THREE.Vector3(...currentTarget)
    );
    lastInteraction.current = Date.now();
  }, [currentFloor]);

  const checkAutoReturn = () => {
    if (Date.now() - lastInteraction.current >= RETURN_DELAY) {
      setUserControlling(false);

      // Используем актуальные цели из пропсов
      startAnimation(
        new THREE.Vector3(...targetPosRef.current),
        new THREE.Vector3(...targetLookAtRef.current)
      );
      const newFloor = targetFloor.current;
      setCurrentFloor(newFloor);
    }
  };

  // Обновление рефов при изменении пропсов
  useEffect(() => {
    targetPosRef.current.set(...position);
    targetLookAtRef.current.set(...target);
    targetFloor.current = floorNumber;

    if (!userControlling) {
      startAnimation(
        new THREE.Vector3(...position),
        new THREE.Vector3(...target)
      );
      if (targetFloor.current !== currentFloor) {
        setCurrentFloor(targetFloor.current);
      }
    }
  }, [position, target]);

  const cancelAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  };

  const startAnimation = (
    targetPos: THREE.Vector3,
    targetLookAt: THREE.Vector3
  ) => {
    cancelAnimation();

    const startPos = new THREE.Vector3().copy(camera.position);
    const startTarget = new THREE.Vector3().copy(
      controlsRef.current?.target || targetLookAt
    );

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / TRANSITION_TIME, 1);

      const easedProgress = easeInOutCubic(progress);

      camera.position.lerpVectors(startPos, targetPos, easedProgress);

      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(
          startTarget,
          targetLookAt,
          easedProgress
        );
        controlsRef.current.update();
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 40, 10]} intensity={1} />
      <PerspectiveCamera near={0.1} far={1000} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={true}
        minDistance={30}
        maxDistance={400}
        minPolarAngle={0}
        maxPolarAngle={0}
        minAzimuthAngle={-0}
        maxAzimuthAngle={0}
        enableDamping={true}
        dampingFactor={SMOOTHNESS}
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
